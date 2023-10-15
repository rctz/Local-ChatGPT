function MessageInput({ value, onChange, onSend }) {
  return (
    <div className="message-input">
      <input type="text" value={value} onChange={onChange} />
      <button onClick={onSend}>Send</button>
    </div>
  );
}

export default MessageInput;
