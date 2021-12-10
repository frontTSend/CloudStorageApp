import { useSelector } from '@/hooks';
import styled from 'styled-components';
import { AiOutlineHome, AiOutlineSearch, AiOutlineFolderOpen, AiOutlineUpload } from 'react-icons/ai'
import Link from 'next/link'

const BottomNav: React.FC = () => {
  const { isSmallWindowSize } = useSelector(props => props.windowSize);

  return (
    <>
      {isSmallWindowSize ? (
        <Wrapper>
          <Inner>
            <Button>
              <Link href="/mypage">
                <a>
                  <AiOutlineHome size="24px" />
                </a>
              </Link>
            </Button>
            <Button>
              <AiOutlineSearch size="24px" />
            </Button>
            <Button>
              <AiOutlineFolderOpen size="24px" />
            </Button>
            <Button>
              <AiOutlineUpload size="24px" />
            </Button>
          </Inner>
        </Wrapper>
      ) : <></>}
    </>
  )
}

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 52px;
  background-color: #fff;
  border-top: 1px solid #ddd;
  z-index: 10000;
`;

const Inner = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0 24px;
`;

const Button = styled.button`
  position: relative;
  width: 52px;
  height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default BottomNav;