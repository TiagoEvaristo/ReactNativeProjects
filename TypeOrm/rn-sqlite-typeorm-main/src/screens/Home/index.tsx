import { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { styles } from './styles';
import { dataSource } from '../../database';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Product } from '../../components/Product';
import { ProductEntity } from '../../database/entities/ProductEntity';

export function Home() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState<ProductEntity[]>([]);

  async function handleRemoveProduct(product : ProductEntity) {
    Alert.alert(
      "Remover item",
      `Deseja remover ${product.name}?`,
      [
        {
          text: "Não",
          style: "cancel"
        },
        {
          text: "Sim",
          onPress: async () => {
            const productRepository = dataSource.manager.getRepository(ProductEntity);
            await productRepository.delete(product.id);
            loadProducts();
          }
        }
      ]	
    );
  }

  async function loadProducts() {
    const productRepository = dataSource.manager.getRepository(ProductEntity);
    const products = await productRepository.find();
    setProducts(products);
  }

  async function handleAddProduct() {
    if (!name.trim() || !quantity.trim()) {
      return Alert.alert('Preencha todos os campos!');
    }

    const product = new ProductEntity();

    product.name = name;
    product.quantity = Number(quantity);

    await dataSource.manager.save(product);

    Alert.alert(`Produto adicionado com o ID ${product.id}`);
    loadProducts();
  }

  useEffect(() => {
    const connect =  async () => {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
        loadProducts();
      }
    }

    connect();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Liste de compras
      </Text>

      <Input
        placeholder="Nome do item"
        onChangeText={setName}
        value={name}
      />

      <Input
        placeholder="Quantidade"
        keyboardType="numeric"
        onChangeText={setQuantity}
        value={quantity}
      />

      <Button
        title="Adicionar"
        onPress={handleAddProduct}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Itens</Text>
        <Text style={styles.headerQuantity}>{products.length}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.items}
        showsVerticalScrollIndicator={false}
      >
        {
          products.map(product => (
            <Product
              key={product.id}
              name={product.name}
              quantity={product.quantity}
              onRemove={() => handleRemoveProduct(product)}
            />
          ))
        }
      </ScrollView>
    </View>
  );
}