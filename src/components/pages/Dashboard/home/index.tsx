// pages/index.js

import Head from 'next/head'
import React from 'react'
import styles from './style.module.css'

const HomePage = () => {
  const chartData = {
    labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'],
    datasets: [
      {
        label: 'Funds Overview',
        backgroundColor: '#00A6ED',
        borderColor: '#00A6ED',
        borderWidth: 1,
        hoverBackgroundColor: '#66C4F8',
        hoverBorderColor: '#66C4F8',
        data: [65, 59, 80, 81, 56],
      },
    ],
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Your Home Page</title>
      </Head>

      <div className={styles.widgetContainer}>
        <div className={`${styles.widget} ${styles.glassEffect}`}>
          <h2>Profit and Loss Overview</h2>
          <p>Current Week: {/* Current week data */}</p>
          <p>Current Month: {/* Current month data */}</p>
          <p>Today: {/* Today's data */}</p>
        </div>
      </div>

      <div className={styles.widgetContainer}>
        <div className={`${styles.widget} ${styles.glassEffect}`}>
          <h2>Funds Overview</h2>
        </div>
      </div>

      <div className={styles.widgetContainer}>
        <div className={`${styles.widget} ${styles.glassEffect}`}>
          <h2>Market LTP</h2>
          <p>Bank Nifty: {/* Bank Nifty data */}</p>
          <p>Nifty 50: {/* Nifty 50 data */}</p>
          <p>FIN NIFTY: {/* FIN NIFTY data */}</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
