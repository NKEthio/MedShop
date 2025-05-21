
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PackagePlus } from 'lucide-react'; 
import Link from 'next/link';
import type { Product } from '@/types';
import { addProduct } from '@/data/products';
import Image from 'next/image'; 

const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number.' })
    .positive({ message: 'Price must be positive.' })
    .min(0.01, { message: 'Price must be at least $0.01.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL or upload an image.' }).or(z.literal('')), 
  dataAiHint: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function SellPage() {
  const { user, userRole, loading: authLoading, roleLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      category: '',
      imageUrl: '',
      dataAiHint: '',
    },
  });

  useEffect(() => {
    const isLoading = authLoading || roleLoading;
    if (!isLoading && (!user || (userRole !== 'seller' && userRole !== 'admin'))) {
      toast({ title: "Access Denied", description: "You must be a seller or admin to list products.", variant: "destructive" });
      router.replace(user ? '/' : '/login?redirect=/sell');
    }
  }, [user, userRole, authLoading, roleLoading, router, toast]);


  const onSubmit = async (data: ProductFormData) => {
    if (!user || (userRole !== 'seller' && userRole !== 'admin')) {
        toast({ title: "Authentication Error", description: "You must be a seller or admin to list products.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);

    const productId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    
    const imageUrl = data.imageUrl || `https://placehold.co/400x300.png`;
    const finalDataAiHint = data.imageUrl ? data.name.split(' ').slice(0,2).join(' ') : (data.dataAiHint || data.name.split(' ').slice(0, 2).join(' '));


    const newProduct: Product = {
        id: productId,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        imageUrl: imageUrl, 
        dataAiHint: finalDataAiHint,
        sellerId: user.uid,
    };

    console.log('Product Data Submitted:', newProduct);

    try {
      
      await new Promise(resolve => setTimeout(resolve, 100)); 
      addProduct(newProduct);
      toast({
        title: "Product Listed!",
        description: `"${data.name}" has been added successfully.`,
      });
      form.reset();
      setImagePreview(null); 
      setSelectedFile(null);
      router.push('/my-products');
    } catch (error) {
      console.error('Failed to add product:', error);
      toast({
        title: "Submission Failed",
        description: "Could not add the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || roleLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (userRole !== 'seller' && userRole !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
         <PackagePlus className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-primary">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You need to be a seller or admin to list products for sale.
        </p>
        <div className="flex gap-4">
            <Link href={user ? "/" : "/login?redirect=/sell"} passHref>
                <Button>{user ? "Go to Homepage" : "Log In"}</Button>
            </Link>
             {!user && <Link href="/signup" passHref>
                <Button variant="outline">Sign Up</Button>
            </Link>}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="w-full max-w-2xl mx-auto shadow-lg animate-fadeIn">
        <CardHeader className="text-center">
           <PackagePlus className="mx-auto h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold text-primary">List Your Product</CardTitle>
          <CardDescription>Fill in the details below to add your medical equipment for sale.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Digital Thermometer" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the product features, condition, etc."
                        className="resize-y min-h-[100px]"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                     <FormDescription>
                       Provide a clear and concise description.
                     </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 29.99"
                            step="0.01"
                            {...field}
                            disabled={isSubmitting}
                            onChange={(e) => field.onChange(e.target.value === '' ? undefined : +e.target.value)}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Diagnostics, Mobility" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              
              
              <FormField
                control={form.control}
                name="imageUrl" 
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                        <div> {/* Replaced React.Fragment with div */}
                         
                         <input type="hidden" {...field} />
                         <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSelectedFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  const dataUrl = reader.result as string;
                                  setImagePreview(dataUrl);
                                  form.setValue('imageUrl', dataUrl); 
                                };
                                reader.readAsDataURL(file);
                              } else {
                                setSelectedFile(null);
                                setImagePreview(null);
                                
                                if (form.getValues('imageUrl').startsWith('data:image')) {
                                   form.setValue('imageUrl', '');
                                }
                              }
                            }}
                            className="mb-2"
                            disabled={isSubmitting}
                          />
                           <Input
                            type="url"
                            placeholder="Or paste image URL here"
                            
                            value={field.value?.startsWith('data:image') ? '' : field.value}
                            onChange={(e) => {
                                field.onChange(e.target.value); 
                                if (!e.target.value.startsWith('data:image') && e.target.value) {
                                    setImagePreview(e.target.value); 
                                    setSelectedFile(null); 
                                } else if (!e.target.value) {
                                    setImagePreview(null);
                                }
                            }}
                            disabled={isSubmitting || !!selectedFile} 
                          />
                        </div>
                    </FormControl>
                    {imagePreview && (
                      <div className="mt-2 relative w-full h-48 border rounded-md overflow-hidden">
                        <Image src={imagePreview} alt="Product preview" layout="fill" objectFit="contain" />
                      </div>
                    )}
                    <FormDescription>
                      Upload an image or paste an image URL. If left empty, a placeholder will be used.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


               <FormField
                control={form.control}
                name="dataAiHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Search Hint (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., stethoscope doctor" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormDescription>
                        Keywords for placeholder if no image is provided (e.g., "medical device").
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Listing Product...
                  </>
                ) : (
                  'List Product for Sale'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

