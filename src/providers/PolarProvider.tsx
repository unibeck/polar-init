import type { Polar } from "@polar-sh/sdk";
// biome-ignore lint/style/useImportType: <explanation>
import React, { createContext } from "react";

interface PolarContextValue {
	client?: Polar;
}

const defaultContextValue: PolarContextValue = {
	client: undefined,
};

export const PolarContext =
	createContext<PolarContextValue>(defaultContextValue);

export interface PolarProviderProps extends React.PropsWithChildren {
	client?: Polar;
}

export const PolarProvider = ({ children, client }: PolarProviderProps) => {
	return (
		<PolarContext.Provider value={{ client }}>{children}</PolarContext.Provider>
	);
};
