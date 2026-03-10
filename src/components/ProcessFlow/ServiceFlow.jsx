import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
//   max-width: 1100px;
  margin: 0 auto;
  background: #ffffffff;
  border-radius: 10px;
//   box-shadow: 0 8px 30px rgba(16, 24, 40, 0.06);
  overflow: hidden;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  color: #1f2937;
`;

const Header = styled.header`
  text-align: center;
//   padding: 24px;
  border-bottom: 1px solid #eef2f6;
  h1 {
    color: #17a2b8;
    font-size: 1.6rem;
    margin: 0;
  }
`;

const Section = styled.section`
  padding: 20px;
  border-bottom: 1px solid #eef2f6;
  &:last-of-type {
    border-bottom: none;
  }
  h2 {
    margin: 0 0 16px;
    font-size: 1.125rem;
    background: linear-gradient(90deg, #fff, #fbfeff);
    padding: 8px 12px;
    border-radius: 8px;
    display: inline-block;
  }
`;

const Lead = styled.p`
  display: block;
  margin: 0 auto 16px;
  padding: 10px 14px;
  border-radius: 8px;
  background: rgba(23, 162, 184, 0.08);
  color: #17a2b8;
  font-weight: 600;
  width: min(720px, 100%);
  text-align: center;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: end;
  margin-bottom: 16px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Col = styled.div`
  flex: 1;
  min-width: 220px;
  text-align: center;
`;

const BigBtn = styled.div`
  display: inline-block;
  padding: 14px 22px;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: default;
  user-select: none;
  box-shadow: 0 4px 12px rgba(2, 6, 23, 0.06);
  margin: 8px 0;
  min-width: 120px;
  text-align: center;

  ${(props) =>
    props.type === "info" &&
    `
    background: rgba(23,162,184,0.08);
    color: #17a2b8;
    border: 1px solid rgba(23,162,184,0.12);
  `}

  ${(props) =>
    props.type === "success" &&
    `
    background: linear-gradient(180deg,#dff5e8,#ecfff3);
    color: #28a745;
    border: 1px solid rgba(40,167,69,0.12);
  `}

  ${(props) =>
    props.type === "danger" &&
    `
    background: linear-gradient(180deg,#ffeef0,#fff6f7);
    color: #dc3545;
    border: 1px solid rgba(220,53,69,0.12);
  `}

  ${(props) =>
    props.type === "warning" &&
    `
    background: linear-gradient(180deg,#fff9e6,#fffef6);
    color: #ffc107;
    border: 1px solid rgba(255,193,7,0.12);
  `}
`;

const Arrow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin: 6px 0;
`;

const ArrowCircle = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 6px rgba(2, 6, 23, 0.05);
  svg {
    width: 16px;
    height: 16px;
  }
`;

const Msg = styled.div`
  display: inline-block;
  padding: 10px 14px;
  border-radius: 8px;
  margin-top: 8px;
  font-weight: 600;
  ${(props) =>
    props.variant === "success" &&
    `
    background: #e9f9ee;
    color: #28a745;
    border: 1px solid rgba(40,167,69,0.07);
  `}
  ${(props) =>
    props.variant === "danger" &&
    `
    background: #fff2f2;
    color: #dc3545;
    border: 1px solid rgba(220,53,69,0.07);
  `}
  ${(props) =>
    props.variant === "info" &&
    `
    background: #eef9fb;
    color: #17a2b8;
    border: 1px solid rgba(23,162,184,0.07);
  `}
`;

const Footer = styled.footer`
  padding: 16px;
  font-size: 0.95rem;
  color: #6c757d;
  background: #fbfdff;
  border-top: 1px solid #eef2f6;
  text-align: center;
`;
import { IoIosArrowForward } from "react-icons/io";
const RightArrow = () => (
  <ArrowCircle>
    <IoIosArrowForward />
  </ArrowCircle>
);

const DownArrow = () => (
  <ArrowCircle>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  </ArrowCircle>
);

export default function ServiceFlow({ steps }) {
  return (
    <Wrapper>
        <Row>
            {steps?.map((step, i) => (
                i >= 3 ? (
                    <React.Fragment key={i}>
                        <Arrow>
                            <DownArrow />
                            </Arrow>
                        <div>
                            <BigBtn type="danger">{step.title}</BigBtn>
                        </div>
                    </React.Fragment>
                ) : (
                    <div key={i}>
                        <BigBtn type="danger">{step.title}</BigBtn>
                    </div>
                )
            ))}

        </Row>

      <Footer>
        <p>
          Footer information here. For more questions please call the person you
          know to call with your questions.
        </p>
      </Footer>
    </Wrapper>
  );
}
