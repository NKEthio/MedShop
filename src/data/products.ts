import type { Product } from '@/types';

// NOTE: Using a placeholder seller ID. In a real app, this would be the actual Firebase UID of the seller.
const PLACEHOLDER_SELLER_ID = 'user_placeholder_id';

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Digital Thermometer',
    description: 'Fast and accurate digital thermometer for oral, rectal, or underarm use.',
    price: 15.99,
    imageUrl: 'https://picsum.photos/seed/thermometer/400/300',
    category: 'Diagnostics',
    dataAiHint: 'digital thermometer',
    sellerId: PLACEHOLDER_SELLER_ID,
  },
  {
    id: 'prod_2',
    name: 'Pulse Oximeter',
    description: 'Fingertip pulse oximeter to measure blood oxygen saturation (SpO2) and pulse rate.',
    price: 29.95,
    imageUrl: 'https://picsum.photos/seed/oximeter/400/300',
    category: 'Diagnostics',
    dataAiHint: 'pulse oximeter',
    sellerId: PLACEHOLDER_SELLER_ID,
  },
  {
    id: 'prod_3',
    name: 'Automatic Blood Pressure Monitor',
    description: 'Easy-to-use upper arm blood pressure monitor with large display.',
    price: 45.50,
    imageUrl: 'https://picsum.photos/seed/bpmonitor/400/300',
    category: 'Diagnostics',
    dataAiHint: 'blood pressure monitor cuff',
    sellerId: PLACEHOLDER_SELLER_ID,
  },
  {
    id: 'prod_4',
    name: 'Stethoscope',
    description: 'Dual-head stethoscope for listening to heart, lung, and other body sounds.',
    price: 22.00,
    imageUrl: 'https://picsum.photos/seed/stethoscope/400/300',
    category: 'Diagnostics',
    dataAiHint: 'stethoscope doctor',
    sellerId: PLACEHOLDER_SELLER_ID,
  },
  {
    id: 'prod_5',
    name: 'Wheelchair',
    description: 'Standard foldable wheelchair with comfortable seating and durable frame.',
    price: 199.99,
    imageUrl: 'https://picsum.photos/seed/wheelchair/400/300',
    category: 'Mobility Aids',
    dataAiHint: 'wheelchair empty',
    sellerId: PLACEHOLDER_SELLER_ID,
  },
  {
    id: 'prod_6',
    name: 'Walking Cane',
    description: 'Adjustable height walking cane with ergonomic handle for support.',
    price: 18.75,
    imageUrl: 'https://picsum.photos/seed/cane/400/300',
    category: 'Mobility Aids',
    dataAiHint: 'walking cane',
    sellerId: PLACEHOLDER_SELLER_ID,
  },
  {
    id: 'prod_7',
    name: 'First Aid Kit',
    description: 'Comprehensive first aid kit for home, office, or travel.',
    price: 35.00,
    imageUrl: 'https://picsum.photos/seed/firstaid/400/300',
    category: 'Supplies',
    dataAiHint: 'first aid kit open',
    sellerId: PLACEHOLDER_SELLER_ID,
  },
  {
    id: 'prod_8',
    name: 'Nebulizer Machine',
    description: 'Compact nebulizer machine for respiratory therapy.',
    price: 55.00,
    imageUrl: 'https://picsum.photos/seed/nebulizer/400/300',
    category: 'Respiratory',
    dataAiHint: 'nebulizer machine',
    sellerId: PLACEHOLDER_SELLER_ID,
  },
];

// Function to add a new product (simulates adding to a database)
export const addProduct = (newProduct: Product) => {
  // In a real app, this would involve an API call to your backend/database
  // For now, we'll just push to the local array if it doesn't exist
  if (!products.find(p => p.id === newProduct.id)) {
    products.push(newProduct);
    console.log('Product added (local mock):', newProduct);
  } else {
    console.warn('Product with this ID already exists (local mock):', newProduct.id);
  }
};

// Function to update an existing product (simulates updating in a database)
export const updateProduct = (updatedProduct: Product) => {
  const index = products.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = updatedProduct;
    console.log('Product updated (local mock):', updatedProduct);
    return true;
  }
  console.error('Product not found for update (local mock):', updatedProduct.id);
  return false;
};

// Function to delete a product (simulates deleting from a database)
export const deleteProduct = (productId: string) => {
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        const deletedProduct = products.splice(index, 1)[0];
        console.log('Product deleted (local mock):', deletedProduct);
        return true;
    }
    console.error('Product not found for deletion (local mock):', productId);
    return false;
};
