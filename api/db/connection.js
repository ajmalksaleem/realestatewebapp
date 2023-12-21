import { connect } from 'mongoose';


const connectToDatabase = async () => {
    try {
        await connect(process.env.MONGO_URL) //no return value because here already return a promise
        console.log("mongodb connected to server")
    }
    catch (error) {
        console.log(error + "unfekvj")
    }


};
export default connectToDatabase;