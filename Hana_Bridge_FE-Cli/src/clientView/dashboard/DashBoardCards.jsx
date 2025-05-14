import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setPage, setCategory } from '../../store/userSlice';


const DashboardCards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardClass =
  "no-underline bg-white text-black px-8 py-4 rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-transform duration-300 h-32 flex flex-col justify-center";

  const movePage = (pageName) => {
    dispatch(setPage({ page: pageName }));
    dispatch(setCategory({ category: "" }));
  }

  const postBoard = (id) => {
    dispatch(setCategory({ category: id }));
    dispatch(setPage({ page: "" }));
    navigate("/board/" + id);
  }; 

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 w-full max-w-3xl mx-auto">
      <button onClick={() => movePage("mypage")} className={cardClass}>
        <h3 className="text-xl font-semibold">My Page</h3>
      </button>

      <button onClick={() => movePage("myposts")} className={cardClass}>
        <h3 className="text-xl font-semibold mb-1">My Posts</h3>
      </button>

      <button onClick={() => postBoard("code")} className={cardClass}>
        <h3 className="text-xl font-semibold">Code Board</h3>
      </button>

      <button onClick={() => postBoard("assemble")} className={cardClass}>
        <h3 className="text-xl font-semibold">Assemble Board</h3>
      </button>
    </div>
  );
};

export default DashboardCards;
