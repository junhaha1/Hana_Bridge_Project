import MDEditor from '@uiw/react-md-editor';

const MarkdownEditor = ({ content, onChange }) => {
  return (
    <div data-color-mode="dark" style={{ borderRadius: '8px' }} className="custom-scroll">
      <MDEditor
        value={content}
        onChange={onChange}
        height={400}
      />
    </div>
  );
};

export default MarkdownEditor;
