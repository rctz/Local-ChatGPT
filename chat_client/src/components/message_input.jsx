function MessageInput({ value, onChange, onSend, onKeyPress }) {
  return (
    <div className="message-input">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyPress}
      />
      <button onClick={onSend}>Send</button>
    </div>
  );
}

export default MessageInput;
