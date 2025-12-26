import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../core/errors/app-error";
import { ZodError } from "zod";

export function ErrorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply
) {

  if(error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      message: error.message
    })
  }

  if(error instanceof ZodError) {
    return reply.status(400).send({
      status: 'fail',
      message: 'Validation error',
      errors: error.issues,
    })
  }

  // Log error for debugging
  console.error('=== UNHANDLED ERROR ===');
  console.error('Error:', error);
  console.error('Error details:', {
    message: error.message,
    code: (error as any)?.code,
    name: error.name,
    stack: error.stack,
  });

  // Se for um erro do Prisma, tentar extrair mais informações
  const prismaError = error as any;
  if (prismaError?.code) {
    console.error('Prisma error code:', prismaError.code);
    console.error('Prisma error meta:', prismaError.meta);
  }
  
  // Log do request se disponível
  if (_request) {
    console.error('Request method:', _request.method);
    console.error('Request URL:', _request.url);
    console.error('Request params:', _request.params);
  }
  console.error('========================');

  return reply.status(500).send({
    status:'error',
    message: 'Internal server error'
  })
}