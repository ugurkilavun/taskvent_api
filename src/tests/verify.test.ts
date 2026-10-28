// import request from "supertest";
// // Server
// import app from "../app";
// // .env
// import dotenv from 'dotenv';
// import { sendVerificationEmail } from "../services/mail.service";
// // Utils
// import { generateURLToken, hashURLToken } from "../utils/urlTokens.util";

// dotenv.config({ quiet: true })

// describe("GET /verify", () => {

//   beforeEach(() => {
//     // connectDB();
//   });

//   // Tokens
//   const fake_URLToken = "af2a8614a1c1d79834f7fa570cf14ad14817f2dd3521d58719ed3c2d6bc49b644";
//   const URLToken = "3e3ca7c3260bbdde22dc4fe3f6612205eabc41fbf53091ff66cf1aca3d7bf41e";

//   it("Generate tokens.", async () => {
//     // * Generate URL Token
//     const urlToken: string = generateURLToken();
//     const hash_URLToken = hashURLToken(urlToken);

//     expect(urlToken).toHaveLength(64);
//     expect(hash_URLToken).toHaveLength(64);
//   });

//   it("It should return 400 Bad Request with an error message.", async () => {

//     const res: any = await request(app).get(`/verify?token=${fake_URLToken}`);

//     expect(res.statusCode).toEqual(400);
//   });

//   it("It should return 200 OK with the message.", async () => {

//     const res: any = await request(app).get(`/verify?token=${URLToken}`);

//     expect(res.statusCode).toEqual(200);
//     expect(res.body.message).toBe('Email verified.');
//   });

//   it("E-mail service.", async () => {

//     await sendVerificationEmail({
//       to: process.env.TEST_EMAIL,
//       name: `${process.env.TEST_FIRSTNAME} ${process.env.TEST_LASTNAME}`,
//       verificationUrl: "www.example.com/verify?token=26ys3sjb262b27h26sdbvh16",
//       lang: "US"
//     });

//   });

// });