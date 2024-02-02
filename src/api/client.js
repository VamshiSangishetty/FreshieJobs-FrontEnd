import axios from "axios";


const client=axios.create({baseURL:'http://freshiejobs-env.eba-c9eevhy7.ap-south-1.elasticbeanstalk.com/api'});

export default client;