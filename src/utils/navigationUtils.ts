import { NavigationProp } from '@react-navigation/native';

// Report navigation handler - centralized function to avoid code duplication
export const handleNavigateToReport = (
  reportData: any,
  navigation: NavigationProp<any>,
  setIsReportsModalOpen?: (open: boolean) => void
) => {
  console.log('Navigation triggered for:', reportData);
  
  // Close modal if provided
  if (setIsReportsModalOpen) {
    setIsReportsModalOpen(false);
  }
  
  // Navigate based on report ID using React Navigation
  switch (reportData.id) {
    case 'financial-reports':
      navigation.navigate('FinancialReports', { reportData });
      break;
    case 'brisa-payments':
      navigation.navigate('BrisaPayments', { reportData });
      break;
    case 'overdue-report':
      navigation.navigate('OverdueReport', { reportData });
      break;
    case 'account-transactions':
      navigation.navigate('AccountTransactions', { reportData });
      break;
    case 'shipments-documents':
      navigation.navigate('ShipmentsDocuments', { reportData });
      break;
    case 'sales-report':
      navigation.navigate('SalesReport', { reportData });
      break;
    case 'order-monitoring':
      navigation.navigate('OrderMonitoring', { reportData });
      break;
    case 'tyres-on-the-way':
      navigation.navigate('TyresOnTheWay', { reportData });
      break;
    case 'pos-material-tracking':
      navigation.navigate('POSMaterialTracking', { reportData });
      break;
    case 'lassa-team':
      navigation.navigate('LassaTeam', { reportData });
      break;
    default:
      console.log('Unknown report type');
  }
};

// Type definitions for better type safety
export interface ReportData {
  id: string;
  [key: string]: any;
}

// Hook for using the navigation handler
export const useReportNavigation = (navigation: NavigationProp<any>) => {
  return (reportData: ReportData, setIsReportsModalOpen?: (open: boolean) => void) => {
    handleNavigateToReport(reportData, navigation, setIsReportsModalOpen);
  };
};
