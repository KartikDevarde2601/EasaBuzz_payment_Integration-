import React from 'react';
import { View, TextInput,Platform, Button, StyleSheet,Text,NativeModules,NativeEventEmitter } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import EasebuzzCheckout from 'react-native-easebuzz-kit';

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  productInfo: yup.string().required('Product info is required'),
  amount: yup.number().required('Amount is required').positive('Amount must be positive'),
});

const callPaymentGateway = (key) => {
    var options = {
      access_key: key,
      pay_mode:"test"
      }
      EasebuzzCheckout.open(options).then((data) => {
      //handle the payment success & failed response here
      console.log("Payment Response:")
      console.log(data);
      }).catch((error) => {
      //handle sdk failure issue here
        console.log("SDK Error:")
        console.log(error);
        });
      }

      function generateRandomString() {
        return Math.random().toString(36).substring(2, 17) + Math.random().toString(36).substring(2, 17);
    }

const handleSubmit = (values) => {
    const initiate_payment =  {
        name: values.name,
        amount: parseFloat(values.amount).toFixed(2).toString(),
        txnid: generateRandomString(),
        email: values.email,
        phone: values.phone.toString(),
        productinfo: values.productInfo,
        unique_id: "",
        split_payments: "",
        sub_merchant_id: "",
        customer_authentication_id: "",
        udf1: "",
        udf2: "",
        udf3: "",
        udf4: "",
        udf5: "",
        udf6: "",
        udf7: "",
        udf8: "",
        udf9: "",
        udf10: ""
   }
    axios.post('http://192.168.150.201:3000/initiate_payment', initiate_payment)
        .then((response) => {
        const access_key = response.data.data
        console.log(access_key)
        callPaymentGateway(access_key)
        })
        .catch((error) => {
        console.log(error);
        });
}

const Form = () => {
    return (
      <Formik
        initialValues={{ name: '', email: '', phone: '', productInfo: '', amount: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <View style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              {errors.name && <Text style={styles.error}>{errors.name}</Text>}
            </View>
  
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
              />
              {errors.email && <Text style={styles.error}>{errors.email}</Text>}
            </View>
  
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Phone"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
            </View>
  
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Product Info"
                onChangeText={handleChange('productInfo')}
                onBlur={handleBlur('productInfo')}
                value={values.productInfo}
              />
              {errors.productInfo && <Text style={styles.error}>{errors.productInfo}</Text>}
            </View>
  
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Amount"
                onChangeText={handleChange('amount')}
                onBlur={handleBlur('amount')}
                value={values.amount}
                keyboardType="numeric"
              />
              {errors.amount && <Text style={styles.error}>{errors.amount}</Text>}
            </View>
  
            <View style={styles.button}>
              <Button onPress={handleSubmit} title="Submit" />
            </View>
          </View>
        )}
      </Formik>
    );
  };
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 10,
    },
    input: {
      width: 300, // Set input width to 100% of the input container
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 5,
    },
    error: {
      color: 'red',
      marginBottom: 5,
    },
    button: {
      marginTop: 10,
    },
  });
  
  

export default Form;
