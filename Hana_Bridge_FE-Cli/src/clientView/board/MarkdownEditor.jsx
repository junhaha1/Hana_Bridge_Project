import MDEditor from '@uiw/react-md-editor';

const MarkdownEditor = ({ content, onChange }) => {
  return (
    <div data-color-mode="dark" style={{ borderRadius: '8px' }} className="custom-scroll md:h-max-[1000px] max-md:h-[300px]">
      <MDEditor
        value={content}
        onChange={onChange}
        height={700}
        preview="edit"
      />
    </div>
  );
};

export default MarkdownEditor;
