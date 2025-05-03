
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { products as allProducts, deleteProduct as deleteProductFromData, updateProduct as updateProductInData } from '@/data/products'; // Import mock data and functions
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// Schema for editing a product (similar to sell page, but all fields optional potentially, or handled differently)
// For simplicity, we reuse a similar schema but make imageUrl optional as it might already exist
const editProductSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number.' })
    .positive({ message: 'Price must be positive.' })
    .min(0.01, { message: 'Price must be at least $0.01.' }),
  category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
  imageUrl: z.string().url({ message: 'Invalid URL format.' }).optional().or(z.literal('')), // Keep optional
  dataAiHint: z.string().optional(),
});

type EditProductFormData = z.infer<typeof editProductSchema>;


export default function MyProductsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productToDelete, setProductToDelete] = useState<string | null>(null); // ID of product pending deletion
  const [productToEdit, setProductToEdit] = useState<Product | null>(null); // Product object pending edit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();


  const form = useForm<EditProductFormData>({
      resolver: zodResolver(editProductSchema),
      defaultValues: { // Set default values when dialog opens
          name: '',
          description: '',
          price: 0,
          category: '',
          imageUrl: '',
          dataAiHint: '',
      },
  });


  // Effect to filter products once user data is available
  useEffect(() => {
    if (!authLoading && user) {
      setIsLoadingProducts(true);
      // Simulate fetching/filtering user's products
      const userProducts = allProducts.filter(p => p.sellerId === user.uid);
      setMyProducts(userProducts);
      setIsLoadingProducts(false);
    } else if (!authLoading && !user) {
      // Redirect if user is not logged in
      router.replace('/login?redirect=/my-products');
    }
  }, [user, authLoading, router]);

  // Effect to populate form when productToEdit changes
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
    // Dialog trigger will open the dialog
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    // AlertDialog trigger will open the confirmation
  };

  const confirmDelete = () => {
    if (productToDelete) {
       console.log("Attempting to delete product (mock):", productToDelete);
      // Use the imported delete function (simulates DB interaction)
      const success = deleteProductFromData(productToDelete);

      if (success) {
          // Update local state to reflect deletion
          setMyProducts(prev => prev.filter(p => p.id !== productToDelete));
          toast({ title: "Success", description: "Product deleted." });
      } else {
          toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
      }
      setProductToDelete(null); // Close dialog
    }
  };

   const onSubmitEdit = async (data: EditProductFormData) => {
        if (!productToEdit) return;
        setIsSubmitting(true);

        const updatedProduct: Product = {
            ...productToEdit, // Spread existing product data
            ...data, // Overwrite with form data
            imageUrl: data.imageUrl || productToEdit.imageUrl, // Keep original image if new URL is empty
        };

        console.log('Updating product (mock):', updatedProduct);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            const success = updateProductInData(updatedProduct); // Update mock data

            if (success) {
                // Update local state
                setMyProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                toast({ title: "Success", description: "Product updated." });
                setProductToEdit(null); // Close dialog
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


  // Loading state for initial auth check
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // User not logged in (should be handled by redirect, but good fallback)
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-center">
         <PackageSearch className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-primary">Please Log In</h1>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your products.</p>
        <Link href="/login?redirect=/my-products" passHref>
            <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  // Loading state for user's products
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
         <h1 className="text-3xl font-bold text-primary">My Listed Products</h1>
         <Link href="/sell" passHref>
           <Button>
             <PackagePlus className="mr-2 h-4 w-4" /> List New Product
           </Button>
         </Link>
      </div>

      {myProducts.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
            <PackageSearch className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-4">You haven't listed any products yet.</p>
            <Link href="/sell" passHref>
                <Button variant="outline">List Your First Product</Button>
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {myProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showActions={true} // Enable edit/delete buttons
              onEdit={() => handleEdit(product)} // Pass edit handler
              onDelete={handleDeleteClick} // Pass delete handler (opens confirmation)
            />
          ))}
        </div>
      )}

        {/* Edit Product Dialog */}
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
                         <div className="grid grid-cols-2 gap-4">
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


      {/* Delete Confirmation Dialog */}
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
