import { Card, Grid, Col, Text, Title, TabGroup, TabList, Tab, TabPanels, TabPanel, DonutChart, AreaChart  } from '@tremor/react'
import React from 'react'
import CustomNavbar from "../commons/CustomNavbar";

const estado = [
  {
    name: "Asistido",
    sales: 10,
  },
  {
    name: "Confirmado",
    sales: 20,
  },
  {
    name: "Cancelado",
    sales: 4,
  },
  {
    name: "Reservado",
    sales: 1,
  }
];

const chartdata = [
  {
    date: "Jan 1",
    SemiAnalysis: 2890,
    "Ventas": 2338,
  },
  {
    date: "Feb 1",
    SemiAnalysis: 2756,
    "Ventas": 2103,
  },
  {
    date: "Mar 1",
    SemiAnalysis: 3322,
    "Ventas": 2194,
  },
  {
    date: "Apr 1",
    SemiAnalysis: 3470,
    "Ventas": 2108,
  },
  {
    date: "May 1",
    SemiAnalysis: 3475,
    "Ventas": 1812,
  },
  {
    date: "Jun 1",
    SemiAnalysis: 3129,
    "Ventas": 1726,
  },
];

const Reports = () => {
  const valueFormatter = (number) => `${Intl.NumberFormat("us").format(number).toString()} Turnos`;
  const dataFormatter = (number) => {
    return "$ " + Intl.NumberFormat("us").format(number).toString();
  };
  return (
    <main >
      <CustomNavbar />
      <div className='p-6 sm:p-10'>
        <Title>Panel de Reportes</Title>
        <Text>Aqui podra ver sus ingresos a modo de grafico.</Text>
        <TabGroup>
          <TabList className="mt-8">
            <Tab>Historial de ingresos</Tab>
            <Tab>Estado de turnos</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <div className="mt-8">              
                <Grid numItemsLg={2} className="gap-6 mt-6">
                  {/* Main section */}
                  <Col numColSpanLg={5}>
                  <Card>
                    <Title>Historial de ingresos (ARS)</Title>
                    <AreaChart
                      className="h-72 mt-4"
                      data={chartdata}
                      index="date"
                      categories={["Ventas"]}
                      colors={["indigo", "cyan"]}
                      valueFormatter={dataFormatter}
                    />
                  </Card>
                  </Col>
                  
                </Grid>
              </div>
            </TabPanel>
            
            <TabPanel>
              <div className="mt-8">              
                <Card>
                  <Title>Estado de turnos</Title>
                  <DonutChart
                    className="h-72 mt-4"
                    data={estado}
                    category="sales"
                    index="name"
                    valueFormatter={valueFormatter}
                    colors={["red", "violet", "indigo", "orange", "cyan", "green"]}
                  />
                </Card>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </main>
  )
}

export default Reports