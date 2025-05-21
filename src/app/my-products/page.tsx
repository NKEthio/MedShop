
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { products as allProducts, deleteProduct as deleteProductFromData, updateProduct as updateProductInData } from '@/data/products';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2, PackagePlus, PackageSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const editProductSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number.' })
    .positive({ message: 'Price must be positive.' })
    .min(0.01, { message: 'Price must be at least $0.01.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  imageUrl: z.string().url({ message: 'Invalid URL format.' }).optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});

type EditProductFormData = z.infer<typeof editProductSchema>;


export default function MyProductsPage() {
  const { user, userRole, loading: authLoading, roleLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditProductFormData>({
      resolver: zodResolver(editProductSchema),
      defaultValues: {
          name: '',
          description: '',
          price: 0,
          category: '',
          imageUrl: '',
          dataAiHint: '',
      },
  });

  useEffect(() => {
    const isLoading = authLoading || roleLoading;
    if (!isLoading) {
      if (!user || (userRole !== 'seller' && userRole !== 'admin')) {
        toast({ title: "Access Denied", description: "You must be a seller or admin to view this page.", variant: "destructive" });
        router.replace(user ? '/' : '/login?redirect=/my-products');
      } else if (user) {
        setIsLoadingProducts(true);
        // Admins see all products, sellers see only their own.
        const userProducts = userRole === 'admin' 
          ? allProducts 
          : allProducts.filter(p => p.sellerId === user.uid);
        setMyProducts(userProducts);
        setIsLoadingProducts(false);
      }
    }
  }, [user, userRole, authLoading, roleLoading, router, toast]);

  useEffect(() => {
    if (productToEdit) {
        form.reset({
            name: productToEdit.name,
            description: productToEdit.description,
            price: productToEdit.price,
            category: productToEdit.category,
            imageUrl: productToEdit.imageUrl,
            dataAiHint: productToEdit.dataAiHint,
        });
    }
  }, [productToEdit, form]);


  const handleEdit = (product: Product) => {
    setProductToEdit(product);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      const success = deleteProductFromData(productToDelete);
      if (success) {
          setMyProducts(prev => prev.filter(p => p.id !== productToDelete));
          toast({ title: "Success", description: "Product deleted." });
      } else {
          toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
      }
      setProductToDelete(null);
    }
  };

   const onSubmitEdit = async (data: EditProductFormData) => {
        if (!productToEdit) return;
        setIsSubmitting(true);
        const updatedProduct: Product = {
            ...productToEdit,
            ...data,
            imageUrl: data.imageUrl || productToEdit.imageUrl,
        };
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const success = updateProductInData(updatedProduct);
            if (success) {
                setMyProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                toast({ title: "Success", description: "Product updated." });
                setProductToEdit(null);
            } else {
                 throw new Error("Failed to update product in mock data.");
            }
        } catch (error) {
            console.error("Failed to update product:", error);
            toast({ title: "Error", description: "Could not update product.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

  if (authLoading || roleLoading || (!user && !authLoading && !roleLoading)) { // Also show loader if user object is not yet available but not loading anymore
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || (userRole !== 'seller' && userRole !== 'admin')) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
         <PackageSearch className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-primary">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You do not have permission to view this page.</p>
        <Link href={user ? "/" : "/login?redirect=/my-products"} passHref>
            <Button>{user ? "Go to Homepage" : "Log In"}</Button>
        </Link>
      </div>
    );
  }

  if (isLoadingProducts) {
     return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
         <p className="ml-4 text-muted-foreground">Loading your products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-3xl font-bold text-primary">
           {userRole === 'admin' ? 'All Listed Products' : 'My Listed Products'}
         </h1>
         {(userRole === 'seller' || userRole === 'admin') && (
            <Link href="/sell" passHref>
              <Button>
                <PackagePlus className="mr-2 h-4 w-4" /> List New Product
              </Button>
            </Link>
         )}
      </div>

      {myProducts.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
            <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-4">
              {userRole === 'admin' ? 'No products have been listed yet.' : "You haven't listed any products yet."}
            </p>
            {(userRole === 'seller' || userRole === 'admin') && (
                <Link href="/sell" passHref>
                    <Button variant="outline">List Your First Product</Button>
                </Link>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {myProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              // Show actions if admin OR if seller and it's their product
              showActions={userRole === 'admin' || (userRole === 'seller' && product.sellerId === user?.uid)}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDeleteClick(product.id)}
            />
          ))}
        </div>
      )}

        <Dialog open={!!productToEdit} onOpenChange={(isOpen) => !isOpen && setProductToEdit(null)}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Make changes to your product details below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4 py-4">
                       <FormField control={form.control} name="name" render={({ field }) => (
                           <FormItem> <FormLabel>Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem>
                       )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                             <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea {...field} className="min-h-[80px]" /></FormControl> <FormMessage /> </FormItem>
                        )} />
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <FormField control={form.control} name="price" render={({ field }) => (
                                 <FormItem> <FormLabel>Price ($)</FormLabel> <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : +e.target.value)} value={field.value ?? ''}/></FormControl> <FormMessage /> </FormItem>
                             )} />
                             <FormField control={form.control} name="category" render={({ field }) => (
                                 <FormItem> <FormLabel>Category</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem>
                             )} />
                         </div>
                         <FormField control={form.control} name="imageUrl" render={({ field }) => (
                             <FormItem> <FormLabel>Image URL</FormLabel> <FormControl><Input type="url" {...field} /></FormControl><FormDescription>Leave blank to keep current image.</FormDescription> <FormMessage /> </FormItem>
                         )} />
                         <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                             <FormItem> <FormLabel>Image Hint</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem>
                         )} />

                         <DialogFooter>
                             <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                             </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

      <AlertDialog open={!!productToDelete} onOpenChange={(isOpen) => !isOpen && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Yes, delete product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
