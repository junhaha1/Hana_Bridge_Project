import ApiClient from "../service/ApiClient"
const TestView = () => {

  const testAction = () => {
    ApiClient.testCode();
  }

  return (
    <div>
      <button
        onClick={testAction}
      >
        test
      </button>
    </div>
  )
} 

export default TestView;