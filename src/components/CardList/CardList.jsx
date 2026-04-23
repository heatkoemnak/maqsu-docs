import React from 'react';
import {
  FaFileInvoiceDollar,
  FaUndo,
  FaMoneyCheckAlt,
  FaBox,
  FaUsers
} from 'react-icons/fa';
import { IoMdArrowForward } from 'react-icons/io';

const CardList = () => {
  const menuItems = [
    {
      icon: <FaFileInvoiceDollar />,
      title: 'Invoices',
      features: [
        'Create and manage customer invoices',
        'Track invoice status (draft, sent, paid, overdue)',
        'Generate recurring invoices',
        'Apply payment terms and discounts'
      ],
      link: '/accounting/invoices',
      color: '#3b82f6'
    },
    {
      icon: <FaUndo />,
      title: 'Credit Notes',
      features: [
        'Issue credit notes for returns or corrections',
        'Apply credits to customer accounts',
        'Track credit note usage'
      ],
      link: '/accounting/credit-notes',
      color: '#8b5cf6'
    },
    {
      icon: <FaMoneyCheckAlt />,
      title: 'Payments',
      features: [
        'Record customer payments',
        'Process vendor payments',
        'Manage payment methods',
        'Track payment status'
      ],
      link: '/accounting/payments',
      color: '#10b981'
    },
    {
      icon: <FaBox />,
      title: 'Products',
      features: [
        'Configure product pricing',
        'Set up taxes and accounting categories',
        'Manage product-specific accounting rules'
      ],
      link: '/accounting/products',
      color: '#f59e0b'
    },
    {
      icon: <FaUsers />,
      title: 'Customers',
      features: [
        'Manage customer accounting profiles',
        'Set payment terms and credit limits',
        'View customer account statements',
        'Track accounts receivable aging'
      ],
      link: '/accounting/customers',
      color: '#ec4899'
    }
  ];

  return (
    <div className="accounting-menu-cards">
      {menuItems.map((item, index) => (
        <div key={index} className="menu-card">
          <div
            className="icon-wrapper"
            style={{backgroundColor: `${item.color}15`}}
          >
            <span style={{color: item.color, fontSize: '28px'}}>
              {item.icon}
            </span>
          </div>

          <h3>{item.title}</h3>

          <ul>
            {item.features.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>

          <a href={item.link} style={{color: item.color}}>
            Learn More <IoMdArrowForward />
          </a>
        </div>
      ))}

      <style jsx>{`
        .accounting-menu-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
        }

        .menu-card {
          background: var(--c-surface);
          border-radius: 16px;
          padding: 28px;
          border: 1px solid var(--c-border);
          transition: all 0.3s ease;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
        }

        .menu-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          background: var(--c-accent-bg);
        }

        .icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        h3 {
          font-size: 22px;
          font-weight: 700;
          color: var(--c-text);
          margin: 0 0 16px 0;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
          flex: 1;
        }

        li {
          font-size: 14px;
          color: var(--c-muted);
          line-height: 1.7;
          margin-bottom: 10px;
          padding-left: 16px;
          position: relative;
        }

        li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--c-faint);
          font-weight: bold;
        }

        a {
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.2s ease;
          margin-top: auto;
        }

        a:hover {
          gap: 8px;
        }
      `}</style>
    </div>
  );
};

export default CardList;