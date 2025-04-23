// import ApiClient from "../service/ApiClient";
import BoardHeader from "./Header";
import { useSelector } from 'react-redux';

const MainBoard = () => {
  const userId = useSelector((state) => state.user.userId) || 'guest';

  return (
    <div>
      <BoardHeader state={{userId: userId}}/>
    </div>
  );
};

export default MainBoard;