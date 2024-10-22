import { Select, TextInput } from "@inkjs/ui";
import type { ProductPriceOneTimeCustomCreate } from "@polar-sh/sdk/models/components/productpriceonetimecustomcreate.js";
import type { ProductPriceOneTimeFixedCreate } from "@polar-sh/sdk/models/components/productpriceonetimefixedcreate.js";
import type { ProductPriceOneTimeFreeCreate } from "@polar-sh/sdk/models/components/productpriceonetimefreecreate.js";
import type { ProductPriceRecurringFixedCreate } from "@polar-sh/sdk/models/components/productpricerecurringfixedcreate.js";
import type { ProductPriceRecurringFreeCreate } from "@polar-sh/sdk/models/components/productpricerecurringfreecreate.js";
import { ProductPriceType } from "@polar-sh/sdk/models/components/productpricetype.js";
import type { ProductsCreateProductCreate } from "@polar-sh/sdk/models/operations/productscreate.js";
import { Box, Text } from "ink";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export interface CreateProductProps {
	onCompletion: (productCreate: ProductsCreateProductCreate) => void;
}

export const CreateProduct = ({ onCompletion }: CreateProductProps) => {
	const [productName, setProductName] = useState("");
	const [productDescription, setProductDescription] = useState("");
	const [productPriceType, setProductPriceType] = useState<ProductPriceType>();
	const [productPriceAmountType, setProductPriceAmountType] = useState<
		"free" | "fixed" | "custom"
	>();

	const handleProductNameSubmit = useCallback((value: string) => {
		setProductName(value);
	}, []);

	const handleProductDescriptionSubmit = useCallback((value: string) => {
		setProductDescription(value);
	}, []);

	const handleProductPricingType = useCallback((value: string) => {
		setProductPriceType(value as ProductPriceType);
	}, []);

	const handleProductPricingAmountType = useCallback((value: string) => {
		setProductPriceAmountType(value as "free" | "fixed" | "custom");
	}, []);

	const field = useMemo(() => {
		if (!productName) {
			return (
				<TextInput
					key="product-name"
					placeholder="Product Name"
					onSubmit={handleProductNameSubmit}
				/>
			);
		}

		if (!productDescription) {
			return (
				<TextInput
					key="product-description"
					placeholder="Product Description"
					onSubmit={handleProductDescriptionSubmit}
				/>
			);
		}

		if (!productPriceType) {
			return (
				<Select
					key="product-pricing-type"
					options={[
						{ label: "One-Time Purchase", value: ProductPriceType.OneTime },
						{ label: "Subscription", value: ProductPriceType.Recurring },
					]}
					onChange={handleProductPricingType}
				/>
			);
		}

		if (!productPriceAmountType) {
			return (
				<Select
					key="product-pricing-amount-type"
					options={[
						{ label: "Fixed", value: "fixed" },
						{ label: "Pay What You Want", value: "custom" },
						{ label: "Free", value: "free" },
					]}
					onChange={handleProductPricingAmountType}
				/>
			);
		}

		return null;
	}, [
		productName,
		productDescription,
		productPriceType,
		productPriceAmountType,
		handleProductDescriptionSubmit,
		handleProductNameSubmit,
		handleProductPricingType,
		handleProductPricingAmountType,
	]);

	useEffect(() => {
		if (!field) {
			let price:
				| ProductPriceOneTimeFreeCreate
				| ProductPriceOneTimeFixedCreate
				| ProductPriceOneTimeCustomCreate
				| ProductPriceRecurringFreeCreate
				| ProductPriceRecurringFixedCreate;

			if (productPriceType === ProductPriceType.OneTime) {
				if (productPriceAmountType === "fixed") {
					price = {
						type: "one_time",
						amountType: "fixed",
						priceAmount: 1000,
					} as ProductPriceOneTimeFixedCreate;
				} else if (productPriceAmountType === "custom") {
					price = {
						type: "one_time",
						amountType: "custom",
					} as ProductPriceOneTimeCustomCreate;
				} else {
					price = {
						type: "one_time",
						amountType: "free",
					} as ProductPriceOneTimeFreeCreate;
				}
			} else {
				if (productPriceAmountType === "fixed") {
					price = {
						type: "recurring",
						amountType: "fixed",
						priceAmount: 1000,
						recurringInterval: "month",
					} as ProductPriceRecurringFixedCreate;
				} else {
					price = {
						type: "recurring",
						amountType: "free",
						recurringInterval: "month",
					} as ProductPriceRecurringFreeCreate;
				}
			}

			onCompletion({
				name: productName,
				description: productDescription,
				// @ts-ignore
				prices: [price],
			});
		}
	}, [
		field,
		onCompletion,
		productName,
		productDescription,
		productPriceAmountType,
		productPriceType,
	]);

	return (
		<Box flexDirection="column" height={4}>
			<Text>Create Product</Text>
			{field}
		</Box>
	);
};
