import express, { Request, Response }  from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = "secret";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

interface SigninRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

// Signup route
app.post("/signup", (req: SigninRequest, res: Response) => {
  const { email, password } = req.body;

  // todo: save user to db and fetch the new user's id
  const userId = 1; // replace with actual user id from db

  const token = jwt.sign(
    {
      id: userId,
    },
    JWT_SECRET
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    })
    .send({
      message: "User registered successfully",
    });
});


app.post("/signin", (req: SigninRequest, res: Response) => {
  const { email, password } = req.body;

  // todo: db validation, fetch id of user from db and use it in jwt
  const token = jwt.sign(
    {
      id: 1,
    },
    JWT_SECRET
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    })
    .send({
      message: "success",
    });
});

app.get("/user", (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  // todo: fetch user data from db using decoded.id

  res.send({
    userId: decoded.id,
  });
});

app.post("/logout", (_, res) => {
  res.clearCookie("token").send({
    message: "Logged out",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
