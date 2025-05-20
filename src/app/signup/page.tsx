
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; // Import setDoc
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Import RadioGroup
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';
import { auth, db } from '@/lib/firebase'; // Use initialized auth and db instance
import type { UserRole } from '@/types'; // Import UserRole type

const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string(),
  role: z.enum(['buyer', 'seller'], { required_error: 'Please select a role.' }), // Add role field
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], 
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined, // Default to undefined
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log('Signup successful:', user);

      // Save user role to Firestore
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { role: data.role as UserRole }); // Cast role to UserRole
        console.log('User role saved to Firestore:', data.role);
      }

      toast({
        title: "Signup Successful!",
        description: "Welcome! You have been successfully registered.",
      });
      router.push('/'); // Redirect to homepage after signup
    } catch (error: any) {
      console.error('Signup Error:', error);
      let errorMessage = "An unexpected error occurred during signup. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email address is already in use. Please use a different email or log in.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "The password is too weak. Please choose a stronger password.";
      }
      // Handle other Firebase auth errors...

      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <UserPlus className="mx-auto h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold text-primary">Create Account</CardTitle>
          <CardDescription>Enter your details below to register.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>I am a...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        disabled={isLoading}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="buyer" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Buyer
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="seller" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Seller
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground flex justify-center">
          Already have an account?&nbsp;
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
