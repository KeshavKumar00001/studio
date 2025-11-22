import { RegisterForm } from '@/components/register-form';
import { Leaf } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="container relative flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Leaf className="mx-auto h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
