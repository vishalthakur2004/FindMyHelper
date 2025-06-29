import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({ 
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import jobRoutes from "./routes/job.routes.js"
import bookingRoutes from "./routes/booking.routes.js"
import jobApplicationRoutes from "./routes/jobApplication.routes.js"
import reviewRoutes from "./routes/review.routes.js"

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/applications", jobApplicationRoutes);
app.use("/api/v1/reviews", reviewRoutes);

export { app }