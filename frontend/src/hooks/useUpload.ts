import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone'
import { useSelector, useFlash } from '@/hooks';
import { mutate } from 'swr';
import { config } from '@/utils';
import { S3ReponseType } from '@/types/S3ResponseType';
import { auth } from '@/utils/aws';
import { MESSAGE_TYPE } from '@/utils/const'
import axios from 'axios';

const useUpload = (onClose: any) => {
  const router = useRouter();
  const flash = useFlash();
  const [files, setFiles] = useState<File[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [uploadDir, setUploadDir] = useState<number | null>(null);
  const [disclosureRange, setDisclosureRange] = useState<number>(0);
  const [complete, setComplete] = useState<boolean>(false);
  const [wait, setWait] = useState<boolean>(false);
  const { keyword } = useSelector(props => props.search);
  const page = Number(router.query.page ?? 1);
  const dir = router.query.dir_id as string;

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const [file] = acceptedFiles;
      setFileName(file.name);
      setDisclosureRange(0);

      if (file.size >= 524288000) {
        alert('一度にアップロードできるサイズは500MBまでです');
        acceptedFiles.pop();

        return;
      }

      setFiles([...files, ...acceptedFiles]);
    },
  })

  const clearFile = () => {
    acceptedFiles.pop();
    setFiles([]);
  }

  const upload = async () => {
    setComplete(false);
    setWait(true);

    if (acceptedFiles.length < 1 || wait) return;

    const [file] = files;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = auth.getIdToken();
      const s3res = await axios.post<S3ReponseType>(`${config.api}/file/upload`, formData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      await axios.post(`${config.api}/post`, {
        description: fileName,
        filePath: s3res.data.Key,
        fileSize: file.size,
        disclosureRange,
        dir: uploadDir,
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      setComplete(true);
      clearFile();
      onClose();
      mutate(`${config.api}/post/all?page=${page}&s=${keyword}&dir=${dir ?? ''}`);
      flash({
        message: 'ファイルのアップロードに成功しました',
        type: MESSAGE_TYPE.NOTICE
      })
    } catch (e) {
      flash({
        message: 'ファイルのアップロードに失敗しました',
        type: MESSAGE_TYPE.ERROR
      })
    } finally {
      setWait(false);
    }
  }

  return {
    getRootProps, getInputProps, upload, clearFile,
    fileName, disclosureRange, uploadDir,
    setFileName, setDisclosureRange, setUploadDir,
    file: files[0], complete
  }
}

export default useUpload;