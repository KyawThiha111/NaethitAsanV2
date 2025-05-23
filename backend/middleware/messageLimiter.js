import messageLimit from "express-rate-limit";

const MessageLimiter = messageLimit({
    windowMs:60 * 60 * 1000, // 1 minute
    max: 5, // Max 5 requests per IP
    message: {
        success:false,
        message:"You can send only 5 messages within an hour."
    }
  })

  export default MessageLimiter;