import React from "react";
import styled from "@emotion/styled";

const ErrorContainer = styled.div`
	color: #000;
	display: flex;
	justify-content: center;
	padding: 0 15x;
	font-size: 14px;
	margin: 10px auto 20px auto;
	width: 100%;
	max-width: 450px;
	opacity: 90;
	animation: 150ms ease-out;
	animation-delay: 50ms;
	animation-fill-mode: forwards;
	will-change: opacity;
	& svg {
		margin-right: 10px;
	}
`;

const ErrorStatus = ({ children }) => (
	<ErrorContainer role="alert">{children}</ErrorContainer>
);

export default ErrorStatus;
