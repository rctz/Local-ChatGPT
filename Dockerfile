# Start with the latest Ubuntu image
FROM ubuntu:latest
# export timezone - for python3.9-dev install
ENV TZ=Asia/Bangkok

# place timezone data /etc/timezone
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Update the package list and install necessary tools and libraries
RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y software-properties-common curl

# Add the deadsnakes PPA to get the latest versions of Python
RUN add-apt-repository ppa:deadsnakes/ppa

# Install Python (in this case, 3.11, but you can adjust as needed)
RUN apt-get update && apt-get install -y python3.11 python3.11-venv python3.11-dev

# Optionally, if you want pip:
RUN apt-get install -y python3-pip

# Confirm installation
RUN python3.11 --version && pip3 --version

# Install OpenSSH client
RUN apt-get install -y openssh-client

# Install Git
RUN apt-get install -y git

# Install Node.js 20.5.1+
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && apt-get clean

ARG GITHUB_REPO_URL=git@github.com:rctz/Local-ChatGPT.git
ARG GITHUB_BRANCH=docker-prep

RUN mkdir ~/.ssh
ARG ssh_prv_key
ARG ssh_pub_key
RUN echo "$ssh_prv_key" > /root/.ssh/id_rsa && \
    echo "$ssh_pub_key" > /root/.ssh/id_rsa.pub && \
    chmod 600 /root/.ssh/id_rsa && \
    chmod 600 /root/.ssh/id_rsa.pub && \
    ssh-keyscan github.com >> /root/.ssh/known_hosts 
    
WORKDIR /app
RUN git clone -b $GITHUB_BRANCH $GITHUB_REPO_URL Local-ChatGPT
RUN rm /root/.ssh/id_rsa*

WORKDIR /app/Local-ChatGPT
RUN pip install --no-cache-dir -r requirements.txt
# RUN python3 manage.py makemigrations
# RUN python3 manage.py migrate
# RUN python3 manage.py collectstatic
# RUN python3 manage.py runserver