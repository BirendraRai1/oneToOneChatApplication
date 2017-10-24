# oneToOneChatApplication
Link of the hosted application:
http://ec2-54-84-24-247.compute-1.amazonaws.com

sign into the AWS 
Go to the EC2 dashboard
Click on launch instance
Select Ubuntu Server 16.04 LTS (HVM), SSD Volume Type
Choose an instance type free trial
Click on edit security group
  a)create a new security group
  b)Name the security group
  c)Click on add rule
  TYPE      Protocol    PortRange     source
  SSH       TCP          22           MYIP
  HTTP      TCP          80           Anywhere
Click on the launch in the review instance
Create a new key pair
Download the key pair and put it in the oneToOneChatApplication folder
Run the command chmod 400 oneToOneChatApplication.pem from the OneToOneChatApplication directory
Run the command sudo ssh -i "oneToOneChatApp.pem" ubuntu@ec2-54-84-24-247.compute-1.amazonaws.com from the 		oneToOneChatApplication directory
Now the server will be created
Install nginx on it
  Run the command
  a)sudo apt-get update
  b)sudo apt get install nginx 
  c)In the cd /etc/nginx
  Run the command sudo service nginx start
Connect to your instance using its Public DNS in the browser:
  a)ec2-54-84-24-247.compute-1.amazonaws.com
  b)you will get welcome nginx message
Get your oneToOneChatApplication from your github repository on the server
  Run the command
  sudo git clone https://github.com/BirendraRai1/oneToOneChatApplication.git
Run the command on the server to install nodejs and npm
  sudo apt-get install nodejs npm
Install the mongodb on the server
In the default file of sites-available directory of nginx write
  server {
	listen 80;
	root /home/ubuntu/oneToOneChatApplication;
	location /{
	proxy_pass http://172.31.93.201:3000;
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	}
Run sudo mongod on the server
Run node app.js from oneToOneChatApplication directory on the server and your application is ready to run 	on AWS 
