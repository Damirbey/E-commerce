import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import Spinner from '../components/Spinner';
import Chart from 'react-google-charts';
import { getError } from '../utils';
import axios from 'axios';
import MessageBox from '../components/MessageBox';

//MANAGING LOCAL STATES
const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return { ...state, loading: false, summary: action.payload };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
};

function AdminDashboardPage(){
    const { state } = useContext(Store);
    const { userInfo } = state;
    //DECLARING LOCAL STATES
    const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });

    useEffect(() => {
        const fetchData = async () => {
          try {
            const { data } = await axios.get('/api/orders/summary',
              {
                headers: { authorization: `Bearer ${userInfo.token}` },
              }
            );
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
          } catch (err) {
            dispatch({
              type: 'FETCH_FAIL',
              payload: getError(err),
            });
          }
        };
        fetchData();
    }, [userInfo]);

    return (
    <div className='dashboard'>
      <Helmet>
        <title>Admin Dashboard</title>
      </Helmet>
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <h1>Dashboard</h1>
          <div className="dashboard_stats">
            <div className="dashboard_stats_statistic">
              <p className="text-bold">
                {summary.users && summary.users[0]
                  ? summary.users[0].numUsers
                  : 0}
              </p>
              <p>Users</p>
            </div>
            <div className="dashboard_stats_statistic">
              <p className="text-bold">
                {summary.orders && summary.orders[0]
                  ? summary.orders[0].numOrders
                  : 0}
              </p>
              <p>Orders</p>
            </div>
            <div className="dashboard_stats_statistic">
              <p className="text-bold">
                $
                {summary.orders && summary.orders[0]
                  ? summary.orders[0].totalSales
                  : 0}
              </p>
              <p>Total Sales</p>
            </div>
          </div>
          <div className="admin_dashboard_graphs">
            <h2>Sales</h2>
            {summary.dailyOrders.length === 0 ? (
            <MessageBox message={'No Sales'} type='alert-danger'/>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="AreaChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Sales'],
                  ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                ]}
              ></Chart>
            )}

            <h2>Categories</h2>
            {summary.productCategories.length === 0 ? (

              <MessageBox message={'No Categories'} type='alert-danger'/>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.productCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </React.Fragment>
      )}
      
    </div>
    );
}

export default AdminDashboardPage;