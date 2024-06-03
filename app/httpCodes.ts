export enum Methods {
  GET = "GET",
  HEAD = "HEAD",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  CONNECT = "CONNECT",
  OPTIONS = "OPTIONS",
  TRACE = "TRACE",
  PATCH = "PATCH",
}

export const Status = {
    200: {
        code: 200,
        message: "OK"
    },
    201: {
        code: 201,
        message: "Created"
    },
    404: {
        code: 404,
        message: "Not Found"
    }
}