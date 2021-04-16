// declare global {
//   namespace Express {
//     interface Request {
//       user: string
//     }
//   }
// }
declare namespace Express {
  export interface Request {
    user: { id: string }
  }
}
