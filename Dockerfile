FROM cypress/included:9.6.0

WORKDIR /cypress

COPY . /cypress

RUN npm i