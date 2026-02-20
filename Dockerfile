# 1. Ubuntu is being installed
FROM ubuntu:latest

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Update the system and install curl
RUN apt update -y && apt install curl -y

# 4. Download Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash -

# 5. Install Node.js & git
RUN apt install git nodejs -y

# 6. -
COPY . /app/

# 7. Download the required packages
RUN npm install

# 8. Specify which port the application is running on (for documentation purposes)
EXPOSE 5276

# 9. Start the application.
CMD ["npm", "run", "dev"]