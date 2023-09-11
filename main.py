from gpt4all import GPT4All
#model = GPT4All("wizardlm-13b-v1.1-superhot-8k.ggmlv3.q4_0.bin")
model = GPT4All(model_name='orca-mini-3b.ggmlv3.q4_0.bin')
flg = True

with model.chat_session() as session:
    while flg:
        text = input("Input: ")
        if text == "end":
            flg = False
        elif text == "":
            pass
        else:
            response1 = session.generate(prompt=text, max_tokens=600, temp=0.5)
            print("Ans: ", response1)

