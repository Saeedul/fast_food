import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignUp = () => {
  // to make the sign in functional, we use a useState snippet.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = async () => {
    // Destructuring the form object to get the name, email, and password so that we dont have to repeat 'form'.
    const { name, email, password } = form;

    if (!name || !email || !password) return Alert.alert('Error', 'Please enter valid name, email and password');

    setIsSubmitting(true);

    try {
      // Here you would typically call your sign-up API
      // Call appwrite Sign up function
      await createUser({ email, password, name, })

      Alert.alert('Success', 'User signed up successfully.');
      router.replace('/');
      // Redirect to home page after successful sign-up
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
      // finally whether the request was successful or not, we set isSubmitting to false which will stop the submitting process.
    }
  }

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your full name"
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        label="Full name"
      />
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
        label="Password"
        secureTextEntry={true}
      />
      <CustomButton
        title="Sign Up"
        isLoading={isSubmitting}
        onPress={submit}
      />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Sign In
        </Link>
      </View>
    </View>
  )
}

export default SignUp