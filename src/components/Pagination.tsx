import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Show first 5 pages + ellipsis + last page
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ellipsis + last 5 pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <View style={styles.container}>
             <View style={styles.infoContainer}>
         <Text 
           style={styles.infoText}
           numberOfLines={1}
           ellipsizeMode="tail"
         >
           Showing {startItem} to {endItem} of {totalItems} entries
         </Text>
       </View>
      
      <View style={styles.paginationContainer}>
        {/* Previous button */}
        <TouchableOpacity
          style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={[styles.pageButtonText, currentPage === 1 && styles.disabledButtonText]}>
            Previous
          </Text>
        </TouchableOpacity>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.pageButton,
              page === currentPage && styles.currentPageButton,
              page === '...' && styles.ellipsisButton
            ]}
            onPress={() => typeof page === 'number' ? onPageChange(page) : null}
            disabled={page === '...'}
          >
            <Text style={[
              styles.pageButtonText,
              page === currentPage && styles.currentPageButtonText,
              page === '...' && styles.ellipsisText
            ]}>
              {page}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Next button */}
        <TouchableOpacity
          style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.pageButtonText, currentPage === totalPages && styles.disabledButtonText]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#6C757D',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    backgroundColor: '#FFFFFF',
    minWidth: 40,
    alignItems: 'center',
  },
  pageButtonText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  currentPageButton: {
    backgroundColor: '#DA3C42',
    borderColor: '#DA3C42',
  },
  currentPageButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#F8F9FA',
    borderColor: '#DEE2E6',
  },
  disabledButtonText: {
    color: '#ADB5BD',
  },
  ellipsisButton: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  ellipsisText: {
    color: '#6C757D',
  },
});

export default Pagination; 