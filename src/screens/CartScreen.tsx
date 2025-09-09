import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Image, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { ListViewIcon, GridViewIcon } from '../components/ViewTypeIcons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { useNavigation } from '@react-navigation/native';
import { addToCart, getCartItems, updateCartItem, removeFromCart, clearCart, purgeCart, type CartItem, addSavedCart, getSavedCarts, getSavedCartById, removeSavedCart, updateSavedCart, type SavedCartStored } from '../utils/storage';
import { t } from '../utils/translations';

type ProductForCart = {
  code: string;
  name: string;
};

type ShipToParty = {
  code: string;
  name: string;
};

type CartRow = {
  productCode: string;
  identifier: string;
  quantity: string;
};

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const CartScreen = () => {
  const navigation = useNavigation();
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Header form state
  const [invoicingMonth, setInvoicingMonth] = useState<string>('');
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [year, setYear] = useState<'2025' | '2026' | ''>('');
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [shipToParty, setShipToParty] = useState<string>('');
  const [poNumber, setPoNumber] = useState<string>('');
  const [incoterms] = useState<string>('DAP');
  const [soldToParty] = useState<string>('93000030');
  const [deliveryNote, setDeliveryNote] = useState<string>('');

  const [productModalRowIndex, setProductModalRowIndex] = useState<number | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState<string>('');
  const [productShow, setProductShow] = useState<number>(100);
  const [isShipToModalOpen, setIsShipToModalOpen] = useState(false);
  const [shipToPartySearch, setShipToPartySearch] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<{ code: string; name: string; image?: string } | null>(null);
  const [cartViewType, setCartViewType] = useState<'table' | 'grid'>('grid');
  const [activeTab, setActiveTab] = useState<'bag' | 'saved'>('bag');
  const [isSavedDetailsOpen, setIsSavedDetailsOpen] = useState(false);
  const [savedDetails, setSavedDetails] = useState<{ number: string; date: string; name: string; description?: string; items: { code: string; qty: number }[]; total: string } | null>(null);
  const [isSaveCartOpen, setIsSaveCartOpen] = useState(false);
  const [saveCartName, setSaveCartName] = useState('');
  const [saveCartDesc, setSaveCartDesc] = useState('');
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [mailTo, setMailTo] = useState('');
  const [lastExportPath, setLastExportPath] = useState<string | null>(null);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState<{ id: string; name: string; count: number } | null>(null);
  const [restoreKeepCopy, setRestoreKeepCopy] = useState(true);
  const [restoreCopyId, setRestoreCopyId] = useState<string>('');
  const [restoreNoSaveLater, setRestoreNoSaveLater] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; count: number } | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');

  const navigateToProductDetail = (code: string) => {
    const base = productCatalog[code];
    const product: any = {
      id: code,
      name: base?.name || `Product ${code}`,
      image: base?.image,
      images: base?.image ? [base.image] : [],
      status: base ? 'Ready for ordering. Price TBD' : undefined,
    };
    // @ts-ignore
    navigation.navigate('ProductDetail', { product });
    setIsSavedDetailsOpen(false);
    setIsPreviewOpen(false);
  };

  type SavedCart = {
    number: string;
    date: string;
    name: string;
    description?: string;
    quantity: number;
    total: string; // formatted
  };
   const [savedCarts, setSavedCarts] = useState<SavedCart[]>([]);

  const products: ProductForCart[] = useMemo(
    () => [
      { code: '211183', name: '195/65R15 91H SNOWAYS ERA' },
      { code: '211751', name: '195/65R15 91H SNOWAYS ERA' },
      { code: '211752', name: '195/65R15 95T XL SNOWAYS ERA' },
      { code: '211982', name: '225/40R18 92V XL SNOWAYS ERA' },
      { code: '212003', name: '215/60R16 99T XL ICEWAYS 2' },
      { code: '212005', name: '185/65R15 88T ICEWAYS 2' },
      { code: '212007', name: '175/65R14 82T ICEWAYS 2' },
      { code: '212008', name: '205/55R16 91T ICEWAYS 2' },
      { code: '212009', name: '185/60R14 82T ICEWAYS 2' },
      { code: '212017', name: '195/65R15 91T ICEWAYS 2' },
      { code: '212018', name: '195/65R15 95T XL ICEWAYS 2' },
      { code: '212019', name: '185/70R14 88T ICEWAYS 2' },
      { code: '212023', name: '225/55R16 95T ICEWAYS 2' },
      { code: '212024', name: '185/60R15 88T XL ICEWAYS 2' },
      { code: '212026', name: '195/55R16 87T ICEWAYS 2' },
    ],
    []
  );

  const [cartItems, setCartItems] = useState<CartItem[]>(getCartItems());

  // Basic product catalog to enrich names in modals and cart
  const productCatalog: Record<string, { name: string; price: number; image?: string }> = {
    '212909': { name: '145/80R13 75T SNOWAYS 3', price: 25.14, image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158' },
    '211183': { name: '195/65R15 91H SNOWAYS ERA', price: 21.93 },
    '211751': { name: '195/65R15 91H SNOWAYS ERA', price: 22.30 },
    '211752': { name: '195/65R15 95T XL SNOWAYS ERA', price: 23.10 },
    '212003': { name: '215/60R16 99T XL ICEWAYS 2', price: 28.50 },
    '212005': { name: '185/65R15 88T ICEWAYS 2', price: 19.80 },
    '280035': { name: '10.00-20 16PR (Sample)', price: 0 },
  };

  // Load saved carts after catalog is defined to avoid undefined references
  useEffect(() => {
    try {
      const stored = getSavedCarts();
      setSavedCarts(
        (stored || []).map((sc) => ({
          number: sc.id,
          date: sc.date,
          name: sc.name,
          description: sc.description,
          quantity: (sc.items || []).reduce((s, i) => s + (i.quantity || 0), 0),
          total: `${(sc.items || []).reduce((s, c) => s + ((productCatalog[c.productId]?.price || 0) * (c.quantity || 0)), 0).toFixed(2)}€`,
        }))
      );
    } catch (e) {
      setSavedCarts([]);
    }
  }, []);

  // Base product list filtered by search (no slicing yet)
  const filteredProductsBase = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    const base = products;
    return q
      ? base.filter((p) => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
      : base;
  }, [productSearch, products]);

  // Cart items as products for modal, filtered by search as well
  const cartProductsForModal = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    const mapped = cartItems.map((ci) => ({
      code: ci.productId,
      name: (productCatalog[ci.productId]?.name || `Product ${ci.productId}`),
      quantity: ci.quantity,
      inCart: true as const,
    }));
    return q
      ? mapped.filter((p) => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q))
      : mapped;
  }, [cartItems, productSearch]);

  // Combined list: cart items first (de-duplicated by code), then other products
  const combinedProductsForModal = useMemo(() => {
    const cartCodes = new Set(cartProductsForModal.map((p) => p.code));
    const rest = filteredProductsBase
      .filter((p) => !cartCodes.has(p.code))
      .map((p) => ({ ...p, inCart: false as const, quantity: 0 }));
    return [...cartProductsForModal, ...rest].slice(0, productShow);
  }, [cartProductsForModal, filteredProductsBase, productShow]);

  const shipToParties: ShipToParty[] = useMemo(
    () => [
      { code: '93000030', name: 'SC RADBURG SOFT SRL' },
      { code: '93000031', name: 'TECH SOLUTIONS LTD' },
      { code: '93000032', name: 'INDUSTRIAL PARTS CO' },
    ],
    []
  );

  const filteredShipToParties = useMemo(() => {
    const q = shipToPartySearch.trim().toLowerCase();
    if (!q) return shipToParties;
    return shipToParties.filter((p) =>
      p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
    );
  }, [shipToPartySearch, shipToParties]);

  const [rows, setRows] = useState<CartRow[]>([]);

  const formatCurrency = (n: number) => `${n.toFixed(2)} €`;
  const computeTotals = () => {
    const orderQty = cartItems.reduce((s, c) => s + (c.quantity || 0), 0);
    const gross = cartItems.reduce((s, c) => s + (productCatalog[c.productId]?.price || 0) * (c.quantity || 0), 0);
    const weight = orderQty * 6.475; // sample per-item weight to match reference UI
    const net = gross; // no tax/discount logic yet
    return { orderQty, gross, weight, net };
  };

  const buildCartWorkbookBase64 = async (): Promise<string> => {
    // Lightweight xlsx export using xlsx lib already in deps
    const XLSX = require('xlsx');
    const rows = getCartItems().map((it) => ({
      Code: it.productId,
      Name: productCatalog[it.productId]?.name || `Product ${it.productId}`,
      Quantity: it.quantity,
      Amount: productCatalog[it.productId]?.price || 0,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cart');
    const outB64: string = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    return outB64;
  };

  const exportExcel = async () => {
    try {
      const b64 = await buildCartWorkbookBase64();
      const fileUri = `${FileSystem.cacheDirectory}Cart_${Date.now()}.xlsx`;
      await FileSystem.writeAsStringAsync(fileUri, b64, { encoding: FileSystem.EncodingType.Base64 });
      setLastExportPath(fileUri);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', dialogTitle: 'Export Excel' });
      } else {
        Alert.alert('Exported', `Saved to ${fileUri}`);
      }
    } catch (e) {
      Alert.alert('Error', 'Excel export failed.');
    }
  };

  const downloadSampleExcel = async () => {
    try {
      const XLSX = require('xlsx');
      const ws = XLSX.utils.aoa_to_sheet([
        ['Code', 'Name', 'Quantity'],
        ['211183', '195/65R15 91H SNOWAYS ERA', 2],
        ['212003', '215/60R16 99T XL ICEWAYS 2', 1],
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sample');
      const outB64: string = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const fileUri = `${FileSystem.cacheDirectory}SampleExcelCis.xlsx`;
      await FileSystem.writeAsStringAsync(fileUri, outB64, { encoding: FileSystem.EncodingType.Base64 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', dialogTitle: 'Download Sample Excel' });
      } else {
        Alert.alert('Saved', `Sample saved to ${fileUri}`);
      }
    } catch {
      Alert.alert('Error', 'Could not generate sample excel.');
    }
  };

  const pickOrderExcel = async () => {
    const DocumentPicker = require('expo-document-picker');
    const res = await DocumentPicker.getDocumentAsync({ type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'] });
    if (res.canceled || !res.assets?.[0]) return;
    const asset = res.assets[0];
    try {
      const b64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
      const XLSX = require('xlsx');
      const wb = XLSX.read(b64, { type: 'base64' });
      const first = wb.SheetNames[0];
      const json = XLSX.utils.sheet_to_json(wb.Sheets[first], { defval: '' });
      // Temporarily cache parsed rows into add rows
      const rowsParsed = json.map((r: any) => ({ productCode: String(r.Code || r.code || r.ProductCode || ''), identifier: String(r.Name || r.name || ''), quantity: String(r.Quantity || r.qty || '') }));
      setRows(rowsParsed.length ? rowsParsed : [{ productCode: '', identifier: '', quantity: '' }]);
      Alert.alert('Loaded', 'Excel imported. Click Refresh Cart to sync.');
    } catch (e) {
      Alert.alert('Error', 'Could not read excel file.');
    }
  };

  const sendMailWithExport = async () => {
    const MailComposer = require('expo-mail-composer');
    try {
      // ensure we have a file
      if (!lastExportPath) {
        await exportExcel();
      }
      const fileUri = lastExportPath!;
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'Mail composer not available on this device.');
        return;
      }
      await MailComposer.composeAsync({
        recipients: mailTo.split(/[;,\s]+/).filter(Boolean),
        subject: 'Cart Export',
        body: 'Attached is the cart export.',
        attachments: [fileUri],
      });
      setIsMailOpen(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to open mail composer.');
    }
  };

  // Collective selection helpers
  const allSelected = cartItems.length > 0 && cartItems.every(ci => !!selectedRows[ci.productId]);
  const someSelected = cartItems.some(ci => !!selectedRows[ci.productId]);
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows({});
      return;
    }
    const next: Record<string, boolean> = {};
    cartItems.forEach(ci => {
      next[ci.productId] = true;
    });
    setSelectedRows(next);
  };

  const openProductModal = (rowIndex: number) => {
    setProductModalRowIndex(rowIndex);
    setIsProductModalOpen(true);
  };

  const handleSelectProduct = (p: ProductForCart) => {
    if (productModalRowIndex === null) return;
    setRows((prev) => {
      const next = [...prev];
      next[productModalRowIndex] = {
        ...next[productModalRowIndex],
        productCode: p.code,
        identifier: p.name,
      };
      return next;
    });
    setProductModalRowIndex(null);
    setIsProductModalOpen(false);
  };

  const handleRefreshCart = () => {
    rows.forEach((r) => {
      const qtyNum = Math.max(0, Math.floor(Number(r.quantity) || 0));
      if (r.productCode && qtyNum > 0) {
        const res: any = addToCart(r.productCode, qtyNum);
        if (res?.ok === false && res?.reason === 'type-mismatch') {
          Alert.alert('Notice', 'You cannot order different types of products together. Please empty your cart to purchase this product.');
        }
      }
    });
    setRows([{ productCode: '', identifier: '', quantity: '' }]); // boş ekleme satırını yeniden oluştur
    setCartItems(purgeCart());
  };

  const addRow = () => setRows((prev) => [...prev, { productCode: '', identifier: '', quantity: '' }]);
  const removeRow = (idx: number) => setRows((prev) => prev.filter((_, i) => i !== idx));

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Breadcrumbs */}
        <View style={styles.breadcrumbRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Dashboard' as never)}>
            <Text style={styles.breadcrumbLink}>Home</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSep}>›</Text>
          <Text style={styles.breadcrumbCurrent}>Cart</Text>
        </View>
        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity onPress={() => setActiveTab('bag')} style={[styles.tabBtn, activeTab==='bag' && styles.tabBtnActive]}>
            <Text style={[styles.tabText, activeTab==='bag' && styles.tabTextActive]}>Bag</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('saved')} style={[styles.tabBtn, activeTab==='saved' && styles.tabBtnActive]}>
            <Text style={[styles.tabText, activeTab==='saved' && styles.tabTextActive]}>Saved Carts ({savedCarts.length})</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'bag' && (
        <>
        <Text style={styles.title}>Create Order</Text>

        {/* Top form */}
        <View style={styles.card}>
          <View style={styles.formRow}>
            <View style={[styles.formCol, styles.formColFull]}>
              <Text style={styles.label}>Invoicing Month</Text>
              <TouchableOpacity style={styles.select} onPress={() => setIsMonthOpen(true)}> 
                <Text style={styles.selectText}>{invoicingMonth || 'Select'}</Text>
              </TouchableOpacity>
            </View>
            </View>
          <View style={styles.formRow}>
            <View style={[styles.formCol, styles.formColFull]}>
              <Text style={styles.label}>Year</Text>
              <TouchableOpacity style={styles.select} onPress={() => setIsYearOpen(true)}>
                <Text style={styles.selectText}>{year || 'Select'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formRow}>
            <View style={[styles.formCol, styles.formColFull]}> 
              <Text style={styles.label}>Ship-To Party :</Text>
              <View style={[styles.inlineGroup, styles.inlineGroupTight, styles.fieldGroupSpacing]}>
                <TextInput
                  placeholder="Enter code"
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      marginBottom: 0,
                    },
                  ]}
                  value={shipToParty}
                  onChangeText={setShipToParty}
                />
                <TouchableOpacity
                  style={[
                    styles.searchBtn,
                    {
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                      marginLeft: 0,
                    },
                  ]}
                  onPress={() => setIsShipToModalOpen(true)}
                  accessibilityLabel="Search ship-to party"
                >
                  <Ionicons name="search" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formCol, styles.formColFull]}>
              <Text style={styles.label}>PO Number :</Text>
              <TextInput style={styles.input} value={poNumber} onChangeText={setPoNumber} />
            </View>
          </View>
          <View style={styles.formRow}>
            <View style={[styles.formCol, styles.formColFull]}>
              <Text style={styles.label}>Incoterms</Text>
              <TextInput style={[styles.input, styles.inputDisabled]} value={incoterms} editable={false} />
            </View>
          </View>
          <View style={styles.formRow}>
            <View style={[styles.formCol, styles.formColFull]}> 
              <Text style={styles.label}>Sold-To Party :</Text>
              <TextInput style={[styles.input, styles.inputDisabled]} value={soldToParty} editable={false} />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.label}>Delivery Note :</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={deliveryNote}
              onChangeText={setDeliveryNote}
              multiline
              numberOfLines={4}
              placeholder="Enter order note"
            />
          </View>
        </View>

        {/* Actions under Delivery Note */}
        <View style={[styles.actions, { marginTop: 14 }]}> 
          <TouchableOpacity style={[styles.actionBtn, styles.primary]}> 
            <View style={styles.actionContent}>
              <Ionicons name="time-outline" size={18} color="#FFFFFF" style={styles.actionIcon} />
              <Text style={[styles.actionBtnText, styles.primaryText]}>Previous Order</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondary]}>
            <View style={styles.actionContent}>
              <MaterialIcons name="file-download" size={18} color="#4CAF50" style={styles.actionIcon} />
              <Text style={styles.actionBtnText}>Export Excel</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondary]} onPress={downloadSampleExcel}>
            <View style={styles.actionContent}>
              <MaterialIcons name="file-download" size={18} color="#4CAF50" style={styles.actionIcon} />
              <Text style={styles.actionBtnText}>Download Sample Excel</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondary]} onPress={exportExcel}>
            <View style={styles.actionContent}>
              <MaterialIcons name="file-download" size={18} color="#4CAF50" style={styles.actionIcon} />
              <Text style={styles.actionBtnText}>Export Excel</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondary]} onPress={pickOrderExcel}>
            <View style={styles.actionContent}>
              <MaterialIcons name="upload-file" size={18} color="#4CAF50" style={styles.actionIcon} />
              <Text style={styles.actionBtnText}>Upload Order</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondary]} onPress={() => { setIsMailOpen(true); setMailTo(''); }}>
            <View style={styles.actionContent}>
              <MaterialIcons name="email" size={18} color="#4CAF50" style={styles.actionIcon} />
              <Text style={styles.actionBtnText}>Mail Gönder</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.primary]} onPress={handleRefreshCart}>
            <View style={styles.actionContent}>
              <Ionicons name="refresh" size={18} color="#FFFFFF" style={styles.actionIcon} />
              <Text style={[styles.actionBtnText, styles.primaryText]}>Refresh Cart</Text>
            </View>
          </TouchableOpacity>
           <TouchableOpacity
             style={[styles.actionBtn, styles.secondary]}
             onPress={() => {
               setSaveCartName(`Cart ${new Date().toLocaleString()}`);
               setSaveCartDesc('');
               setIsSaveCartOpen(true);
             }}
           >
            <View style={styles.actionContent}>
              <Ionicons name="cart-outline" size={18} color="#4CAF50" style={styles.actionIcon} />
              <Text style={styles.actionBtnText}>Save Cart</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.disabledBtn]} disabled>
            <View style={styles.actionContent}>
              <Ionicons name="trash-outline" size={18} color="#AEB4B9" style={styles.actionIcon} />
              <Text style={[styles.actionBtnText, { color: '#AEB4B9' }]}>Delete</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* AddRow removed per request */}

        {/* Cart view type toggle */}
        {cartItems.length > 0 && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 16, marginTop: 10 }}>
            <TouchableOpacity onPress={() => setCartViewType('table')} style={[styles.viewToggleBtn, cartViewType==='table' && styles.viewToggleActive]}>
              <ListViewIcon color={cartViewType==='table' ? '#0066CC' : '#666666'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCartViewType('grid')} style={[styles.viewToggleBtn, cartViewType==='grid' && styles.viewToggleActive]}>
              <GridViewIcon color={cartViewType==='grid' ? '#0066CC' : '#666666'} />
            </TouchableOpacity>
          </View>
        )}

         {/* Current cart items - table-like list with horizontal scroll and an add-row at end */}
         {cartViewType === 'table' ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScroll}>
            <View style={[styles.tableWrap, styles.tableFixedWidth]}>
            {/* Header */}
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              <Text style={[styles.thCell, { width: 56 }]}>Image</Text>
              <TouchableOpacity onPress={toggleSelectAll} style={{ width: 120 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.checkbox, (allSelected || someSelected) && styles.checkboxChecked, { marginRight: 8, alignItems: 'center', justifyContent: 'center' }]}>
                    {allSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    {!allSelected && someSelected && <Ionicons name="remove" size={14} color="#FFFFFF" />}
                  </View>
                    <Text style={styles.thCell}>Selection</Text>
                </View>
              </TouchableOpacity>
              <Text style={[styles.thCell, { width: 88 }]}>Code</Text>
              <Text style={[styles.thCell, { flex: 1 }]}>Identifier</Text>
              <Text style={[styles.thCell, { width: 88 }]}>Quantity</Text>
              <Text style={[styles.thCell, { width: 64 }]}>Unit</Text>
              <Text style={[styles.thCell, { width: 96, textAlign: 'right' }]}>Amount</Text>
              <Text style={[styles.thCell, { width: 44 }]}></Text>
            </View>

            {/* Rows */}
        {cartItems.map((ci) => {
              const p = productCatalog[ci.productId] || { name: `Product ${ci.productId}`, price: 0 };
              const checked = !!selectedRows[ci.productId];
              const amount = (p.price || 0) * (ci.quantity || 0);
              return (
                <View key={ci.productId} style={[styles.tableRow, styles.tableBodyRow]}> 
                  {/* Image */}
                  <View style={[styles.tdCell, { width: 56 }]}> 
                    <TouchableOpacity
                      onPress={() => {
                        setPreviewProduct({ code: ci.productId, name: p.name, image: productCatalog[ci.productId]?.image });
                        setIsPreviewOpen(true);
                      }}
                    >
                      {productCatalog[ci.productId]?.image ? (
                        <Image source={{ uri: productCatalog[ci.productId]!.image }} style={styles.thumbImg} />
                      ) : (
                        <View style={styles.thumb} />
                      )}
                    </TouchableOpacity>
                  </View>
                  {/* Collective checkbox */}
                  <View style={[styles.tdCell, { width: 120 }]}> 
                    <TouchableOpacity
                      style={[styles.checkbox, checked && styles.checkboxChecked, { alignItems: 'center', justifyContent: 'center' }]}
                      onPress={() => setSelectedRows((s) => ({ ...s, [ci.productId]: !checked }))}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked }}
                    >
                      {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </TouchableOpacity>
                  </View>
                  {/* Code */}
                  <View style={[styles.tdCell, { width: 88 }]}>
                    <Text style={styles.codeText}>{ci.productId}</Text>
                  </View>
                  {/* Identifier */}
                  <View style={[styles.tdCell, { flex: 1 }]}> 
                    <Text 
                      style={styles.linkText}
                      onPress={() => { setPreviewProduct({ code: ci.productId, name: p.name, image: productCatalog[ci.productId]?.image }); setIsPreviewOpen(true); }}
                      numberOfLines={1}
                    >
                      {p.name}
                    </Text>
                  </View>
                  {/* Quantity */}
                  <View style={[styles.tdCell, { width: 88 }]}> 
                    <TextInput
                      style={[styles.input, { width: 72, height: 34, textAlign: 'center', textAlignVertical: 'center', paddingVertical: 0 }]}
                      keyboardType="numeric"
                      value={String(ci.quantity)}
                      onChangeText={(v) => {
                        const n = Math.max(0, Math.floor(Number(v) || 0));
                        updateCartItem(ci.productId, n);
                        setCartItems(getCartItems());
                      }}
                    />
                  </View>
                  {/* Unit */}
                  <View style={[styles.tdCell, { width: 64 }]}> 
                    <Text style={{ color: '#444' }}>Piece</Text>
                  </View>
                  {/* Amount */}
                  <View style={[styles.tdCell, { width: 96 }]}> 
                    <Text style={{ color: '#111', fontWeight: '700', textAlign: 'right' }}>{formatCurrency(amount)}</Text>
                  </View>
                  {/* Delete */}
                  <View style={[styles.tdCell, { width: 44, alignItems: 'flex-end' }]}> 
                    <TouchableOpacity onPress={() => { removeFromCart(ci.productId); setCartItems(getCartItems()); }}>
                      <Text style={{ color: '#D53439' }}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            {/* Add row inline at bottom of list (styled like other rows) */}
            <View style={[styles.tableRow, styles.tableBodyRow]}> 
              {/* Image placeholder */}
              <View style={[styles.tdCell, { width: 56 }]}>
                <View style={styles.thumb} />
              </View>
              {/* Selection checkbox (visual only) */}
              <View style={[styles.tdCell, { width: 120 }]}> 
                <View style={styles.checkbox} />
              </View>
              {/* Code with inline search */}
              <View style={[styles.tdCell, { width: 88 }]}> 
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    style={[styles.input, styles.tableInput, styles.joinedInput, { width: 50, marginBottom: 0, marginLeft: -5 }]}
                    placeholder="Code"
                    value={rows[0]?.productCode || ''}
                    onChangeText={(v) => setRows([{ ...(rows[0] || { productCode: '', identifier: '', quantity: '' }), productCode: v }])}
                  />
                  <TouchableOpacity style={[styles.searchBtnXS, styles.joinedSearch]} onPress={() => openProductModal(0)}>
                    <Ionicons name="search" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              {/* Identifier */}
              <View style={[styles.tdCell, { flex: 1 }]}> 
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 3, width: '100%' }}> 
                  <TextInput
                    style={[styles.input, styles.tableInput, styles.joinedInput, { flexGrow: 0, marginBottom: 0, maxWidth: 192, minWidth: 144 } ]}
                    placeholder="Identifier"
                    value={rows[0]?.identifier || ''}
                    onChangeText={(v) => setRows([{ ...(rows[0] || { productCode: '', identifier: '', quantity: '' }), identifier: v }])}
                  />
                </View>
              </View>
              {/* Qty with in-input unit */}
              <View style={[styles.tdCell, { width: 88 }]}> 
                <View style={styles.qtyInputWrap}> 
                  <TextInput
                    style={[styles.input, styles.tableInput, { width: 72, textAlign: 'center', paddingRight: 30 }]}
                    keyboardType="numeric"
                    placeholder="Qty"
                    value={rows[0]?.quantity || ''}
                    onChangeText={(v) => setRows([{ ...(rows[0] || { productCode: '', identifier: '', quantity: '' }), quantity: v }])}
                  />
                  {!!(Number(rows[0]?.quantity) > 0) && (
                    <Text style={styles.unitInside}>
                      {Number(rows[0]?.quantity) === 1 ? 'Piece' : 'Pieces'}
                    </Text>
                  )}
                </View>
              </View>
              {/* Unit (empty for add-row because unit shown inside qty) */}
              <View style={[styles.tdCell, { width: 64 }]} />
              {/* Amount (empty) */}
              <View style={[styles.tdCell, { width: 96 }]} />
              {/* Delete */}
              <View style={[styles.tdCell, { width: 44, alignItems: 'flex-end' }]}> 
                <TouchableOpacity onPress={() => setRows([])}>
                  <Text style={{ color: '#D53439' }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </ScrollView>
        ) : null}
         {/* Current cart items - PLP grid cards with add-row card on bottom */}
         {cartViewType === 'grid' ? (
          <View style={styles.cartGrid}>
            {/* Grid select-all */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 6 }}>
              <TouchableOpacity onPress={toggleSelectAll} style={{ marginRight: 8 }}>
                <View style={[styles.checkbox, (allSelected || someSelected) && styles.checkboxChecked, { alignItems: 'center', justifyContent: 'center' }]}>
                  {allSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  {!allSelected && someSelected && <Ionicons name="remove" size={14} color="#FFFFFF" />}
                </View>
              </TouchableOpacity>
              <Text style={{ color: '#6B7280', fontWeight: '700', fontSize: 12 }}>Selection</Text>
            </View>

            {cartItems.map((ci) => {
              const p = productCatalog[ci.productId] || { name: `Product ${ci.productId}`, price: 0 };
              const amount = (p.price || 0) * (ci.quantity || 0);
                return (
                  <View key={ci.productId} style={styles.cartGridCard}>
                    <View style={styles.cartGridHeader}>
                      <View style={styles.cartGridTitleBlock}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text numberOfLines={2} style={[styles.cartGridName, { paddingRight: 6, flexShrink: 1 }]}>{p.name}</Text>
                          <TouchableOpacity
                            onPress={() => setSelectedRows((s) => ({ ...s, [ci.productId]: !s[ci.productId] }))}
                            style={[styles.checkbox, selectedRows[ci.productId] && styles.checkboxChecked, { marginLeft: 6, alignItems: 'center', justifyContent: 'center' }]}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: !!selectedRows[ci.productId] }}
                          >
                            {!!selectedRows[ci.productId] && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                          </TouchableOpacity>
                        </View>
                        <Text numberOfLines={1} style={styles.cartGridId}>{ci.productId}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.cartGridPrice}>{formatCurrency(p.price || 0)}</Text>
                      <Text style={styles.cartGridLineAmount}>{formatCurrency(amount)}</Text>
                    </View>
                  </View>
                  <View style={styles.cartGridBody}>
                    <TouchableOpacity
                      onPress={() => {
                        setPreviewProduct({ code: ci.productId, name: p.name, image: productCatalog[ci.productId]?.image });
                        setIsPreviewOpen(true);
                      }}
                      activeOpacity={0.85}
                    >
                      {productCatalog[ci.productId]?.image ? (
                        <Image source={{ uri: productCatalog[ci.productId]!.image }} style={styles.cartGridImage} />
                      ) : (
                        <View style={styles.cartGridImagePlaceholder} />
                      )}
                    </TouchableOpacity>
                    <View style={styles.cartGridActions}>
                      <View style={styles.qtySelector}> 
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => { const n = Math.max(0, (ci.quantity || 0) - 1); updateCartItem(ci.productId, n); setCartItems(getCartItems()); }}>
                          <Text style={styles.qtyBtnText}>-</Text>
                        </TouchableOpacity>
                        <TextInput style={styles.qtyInput} keyboardType="numeric" value={String(ci.quantity)} onChangeText={(v)=>{ const n=Math.max(0,Math.floor(Number(v)||0)); updateCartItem(ci.productId,n); setCartItems(getCartItems()); }} />
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => { const n = (ci.quantity || 0) + 1; updateCartItem(ci.productId, n); setCartItems(getCartItems()); }}>
                          <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity style={styles.removeBtn} onPress={() => { removeFromCart(ci.productId); setCartItems(getCartItems()); }}>
                        <Text style={styles.removeBtnText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
            {/* Add row card at end */}
            <View style={styles.cartGridCard}>
              <Text style={styles.rowTitle}>Add item</Text>
              <View style={[styles.inlineGroup, styles.inlineGroupTight]}>
                <TextInput
                  style={[styles.input, styles.joinedInput, { flex: 1, width: undefined, marginBottom: 0 }]}
                  placeholder="Product code"
                  value={rows[0]?.productCode || ''}
                  onChangeText={(v) => setRows([{ ...(rows[0] || { productCode: '', identifier: '', quantity: '' }), productCode: v }])}
                />
                <TouchableOpacity style={[styles.searchBtnOrange, styles.joinedSearch, { height: 40, width: 44 }]} onPress={() => openProductModal(0)}>
                  <Ionicons name="search" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              {!!rows[0]?.identifier && <Text style={styles.identifierText}>{rows[0]?.identifier}</Text>}
              <View style={[styles.inlineGroup, { marginTop: 10 }]}> 
                <View style={[styles.qtyInputWrap, { width: 140 }]}> 
                  <TextInput
                    style={[styles.input, { width: '100%', paddingRight: 46, height: 40, marginBottom: 0, textAlign: 'left' }]}
                    keyboardType="numeric"
                    placeholder="Quantity"
                    value={rows[0]?.quantity || ''}
                    onChangeText={(v) => setRows([{ ...(rows[0] || { productCode: '', identifier: '', quantity: '' }), quantity: v }])}
                  />
                  {!!(Number(rows[0]?.quantity) > 0) && (
                    <Text style={[styles.unitInside, { right: 10 }]}>
                      {Number(rows[0]?.quantity) === 1 ? 'Piece' : 'Pieces'}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {/* Bottom controls under table */}
        {cartItems.length > 0 && (
         <View style={[styles.bottomTableControls, { justifyContent: 'flex-end' }]}>
           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
             <TextInput style={[styles.input, { width: 70, height: 40, marginBottom: 0 }]} value={'1'} editable={false} />
             <TouchableOpacity style={[styles.addRowBtn]} onPress={addRow}>
               <Text style={styles.addRowBtnText}>Add Row</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.addRowBtn, { backgroundColor: '#4CAF50' }]} onPress={handleRefreshCart}>
               <Text style={[styles.addRowBtnText, { color: '#fff' }]}>Refresh Cart</Text>
             </TouchableOpacity>
             <TouchableOpacity style={[styles.addRowBtn, { backgroundColor: '#EDF2F7', borderWidth: 1, borderColor: '#CBD5E0' }]} onPress={() => { clearCart(); setCartItems(getCartItems()); }}>
               <Text style={[styles.addRowBtnText]}>Clear Cart</Text>
             </TouchableOpacity>
           </View>
         </View>
        )}

        {/* Summary */}
        {cartItems.length > 0 && (() => {
          const t = computeTotals();
          return (
            <>
              <View style={styles.summaryCard}> 
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <View style={styles.summaryRowSplit}> 
                  <View style={[styles.summaryCell, styles.summaryCellLeft]}> 
                    <Text style={styles.summaryMetricLabel}>Order Quantity</Text>
                    <Text style={styles.summaryMetricValue}>{t.orderQty}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={[styles.summaryCell, styles.summaryCellRight]}> 
                    <Text style={styles.summaryMetricLabel}>Weight</Text>
                    <Text style={styles.summaryMetricValue}> {t.weight.toFixed(3)} <Text style={styles.summaryMetricUnit}>KG</Text></Text>
                  </View>
                </View>
                <View style={styles.summaryGrossRow}>
                  <Text style={styles.summaryGrossLabel}>Gross Amount</Text>
                  <Text style={styles.summaryGrossValue}>{formatCurrency(t.gross)}</Text>
                </View>
              </View>
              <View style={styles.netCard}>
                <Text style={styles.netLabel}>Net Amount</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4, marginBottom: 12 }}>
                  <Text style={styles.netValue}>{t.net.toFixed(2)}</Text>
                  <Text style={{ color: '#666', fontSize: 18, marginLeft: 4 }}>€</Text>
                </View>
                <TouchableOpacity style={styles.buyNowBtn}>
                  <Text style={styles.buyNowText}>Buy now</Text>
                </TouchableOpacity>
              </View>
            </>
          );
        })()}
        <Footer />
        </>
        )}

        {activeTab === 'saved' && (
          <View style={{ paddingHorizontal: 16 }}>
            {savedCarts.map((s) => (
              <View key={s.number} style={styles.savedCard}>
                <View style={styles.savedHeader}>
                  <Text style={styles.savedNumber}>{s.number}</Text>
                  <Text style={styles.savedDate}>{s.date}</Text>
                </View>
                <Text style={styles.savedName}>{s.name}</Text>
                {!!s.description && <Text style={styles.savedDesc}>{s.description}</Text>}
                <View style={styles.savedInfoRow}>
                  <View style={styles.savedInfoPill}>
                    <Ionicons name="cart-outline" size={14} color="#2E7D32" />
                    <Text style={styles.savedInfoText}>{s.quantity} Quantity</Text>
                  </View>
                  <Text style={styles.savedTotal}>{s.total}</Text>
                </View>
                <View style={styles.savedFooter}>
                  <TouchableOpacity
                    style={[styles.savedBtn, styles.savedBtnGray]}
                    onPress={() => {
                      const sc = getSavedCarts().find(c => c.id === s.number) || getSavedCartById?.(s.number as any);
                      if (!sc) return;
                      const items = sc.items.map(i => ({ code: i.productId, qty: i.quantity }));
                      const total = `${sc.items.reduce((sum, c) => sum + (productCatalog[c.productId]?.price || 0) * (c.quantity || 0), 0).toFixed(2)} €`;
                      setSavedDetails({ number: sc.id, date: sc.date, name: sc.name, description: sc.description, items, total });
                      setIsSavedDetailsOpen(true);
                    }}
                  >
                    <Text style={styles.savedBtnTextGray}>Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.savedBtn, styles.savedBtnGreen]}
                    onPress={() => {
                      const sc = getSavedCarts().find(c => c.id === s.number) || getSavedCartById?.(s.number as any);
                      if (!sc) return;
                      setRestoreTarget({ id: sc.id, name: s.name, count: sc.items.length });
                      setRestoreCopyId(String(Date.now()));
                      setRestoreKeepCopy(true);
                      setRestoreNoSaveLater(false);
                      setIsRestoreOpen(true);
                    }}
                  >
                    <Text style={styles.savedBtnTextGreen}>Move to Basket</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Month selector */}
      <Modal transparent visible={isMonthOpen} statusBarTranslucent={true} onRequestClose={() => setIsMonthOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsMonthOpen(false)} />
        <View style={styles.modalPanel}>
          <Text style={styles.modalTitle}>Invoicing Month</Text>
          <ScrollView style={{ maxHeight: 360 }}>
            {months.map((m) => (
              <TouchableOpacity key={m} style={styles.optionItem} onPress={() => { setInvoicingMonth(m); setIsMonthOpen(false); }}>
                <Text style={styles.optionText}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Edit Saved Cart modal */}
      <Modal transparent animationType="fade" visible={isEditOpen} statusBarTranslucent={true} onRequestClose={() => setIsEditOpen(false)}>
        <View style={styles.centerOverlay}>
          <TouchableOpacity style={styles.overlayBg} onPress={() => setIsEditOpen(false)} />
          <View style={[styles.centerPanel, { maxWidth: 560 }]}> 
            <View style={[styles.savedDetailsHeader, { borderBottomColor: '#E0E0E0' }]}> 
              <Text style={[styles.modalTitle, { color: '#fff' }]}>Save Cart</Text>
            </View>
            <View style={{ padding: 12 }}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[styles.input, { marginBottom: 14 }]}
                placeholder="Enter name"
                value={editName}
                onChangeText={setEditName}
              />
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Enter description"
                value={editDesc}
                onChangeText={setEditDesc}
                multiline
              />
              <TouchableOpacity
                style={[styles.sdBtnGreen, { marginTop: 12 }]}
                onPress={() => {
                  if (!editId) return;
                  const sc = getSavedCartById(editId);
                  if (!sc) { setIsEditOpen(false); return; }
                  const updated = { ...sc, name: editName.trim() || sc.name, description: editDesc } as SavedCartStored;
                  updateSavedCart(updated);
                  const stored = getSavedCarts();
                  setSavedCarts(stored.map(s => ({
                    number: s.id,
                    date: s.date,
                    name: s.name,
                    description: s.description,
                    quantity: (s.items || []).reduce((acc, i) => acc + (i.quantity || 0), 0),
                    total: `${(s.items || []).reduce((sum, c) => sum + ((productCatalog[c.productId]?.price || 0) * (c.quantity || 0)), 0).toFixed(2)}€`
                  })));
                  // if details open, reflect
                  setSavedDetails(prev => prev && prev.number === editId ? { ...prev, name: updated.name, description: updated.description } : prev);
                  setIsEditOpen(false);
                }}
              >
                <Text style={styles.sdBtnText}>Save Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Delete Saved Cart modal */}
      <Modal transparent animationType="fade" visible={isDeleteOpen} statusBarTranslucent={true} onRequestClose={() => setIsDeleteOpen(false)}>
        <View style={styles.centerOverlay}>
          <TouchableOpacity style={styles.overlayBg} onPress={() => setIsDeleteOpen(false)} />
          <View style={[styles.centerPanel, { maxWidth: 560 }]}> 
            <Text style={[styles.modalTitle, { marginBottom: 12 }]}>Delete Saved Cart</Text>
            <Text style={{ color: '#374151', marginBottom: 10 }}>The following cart will be deleted</Text>
            <View style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                  <Text style={{ color: '#6B7280' }}>Cart Name</Text>
                </View>
                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={{ color: '#111827', fontWeight: '700' }}>{deleteTarget?.name || '-'}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                <View style={{ flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                  <Text style={{ color: '#6B7280' }}>ID</Text>
                </View>
                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={{ color: '#111827' }}>{deleteTarget?.id || '-'}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                <View style={{ flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                  <Text style={{ color: '#6B7280' }}>Number of products</Text>
                </View>
                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={{ color: '#111827' }}>{deleteTarget?.count ?? '-'}</Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
              <TouchableOpacity
                style={[styles.sdBtnGreen, { flex: 1 }]}
                onPress={() => {
                  if (!deleteTarget) { setIsDeleteOpen(false); return; }
                  removeSavedCart(deleteTarget.id);
                  const stored = getSavedCarts();
                  setSavedCarts(stored.map(sc => ({
                    number: sc.id,
                    date: sc.date,
                    name: sc.name,
                    description: sc.description,
                    quantity: (sc.items || []).reduce((s, i) => s + (i.quantity || 0), 0),
                    total: `${(sc.items || []).reduce((s, c) => s + ((productCatalog[c.productId]?.price || 0) * (c.quantity || 0)), 0).toFixed(2)}€`
                  })));
                  setIsDeleteOpen(false);
                  setIsSavedDetailsOpen(false);
                }}
              >
                <Text style={styles.sdBtnText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnWhite, { flex: 1 }]} onPress={() => setIsDeleteOpen(false)}>
                <Text style={styles.btnWhiteText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Restore Saved Cart modal */}
      <Modal transparent animationType="fade" visible={isRestoreOpen} statusBarTranslucent={true} onRequestClose={() => setIsRestoreOpen(false)}>
        <View style={styles.centerOverlay}>
          <TouchableOpacity style={styles.overlayBg} onPress={() => setIsRestoreOpen(false)} />
          <View style={[styles.centerPanel, { maxWidth: 560 }]}> 
            <Text style={[styles.modalTitle, { marginBottom: 6 }]}>Restore Saved Cart</Text>
            <Text style={{ color: '#374151', marginBottom: 10 }}>The following saved cart will restore as active cart</Text>
            <View style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden' }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                  <Text style={{ color: '#6B7280' }}>Cart Name</Text>
                </View>
                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={{ color: '#111827', fontWeight: '700' }}>{restoreTarget?.name || '-'}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                <View style={{ flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                  <Text style={{ color: '#6B7280' }}>ID</Text>
                </View>
                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={{ color: '#111827' }}>{restoreTarget?.id || '-'}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
                <View style={{ flex: 1, padding: 10, borderRightWidth: 1, borderRightColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                  <Text style={{ color: '#6B7280' }}>Number of products</Text>
                </View>
                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={{ color: '#111827' }}>{restoreTarget?.count ?? '-'}</Text>
                </View>
              </View>
            </View>
            <View style={{ marginTop: 12 }}>
              <TouchableOpacity onPress={() => setRestoreKeepCopy(!restoreKeepCopy)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={[styles.checkbox, restoreKeepCopy && styles.checkboxChecked, { marginRight: 8, alignItems: 'center', justifyContent: 'center' }]}>
                  {restoreKeepCopy && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={{ color: '#374151' }}>Keep a copy of this cart on saved list</Text>
              </TouchableOpacity>
              <Text style={{ color: '#6B7280', marginBottom: 6 }}>The current items in the cart will be saved as:</Text>
              <TextInput style={[styles.input, { marginBottom: 10 }]} editable={restoreKeepCopy && !restoreNoSaveLater} value={restoreCopyId} onChangeText={setRestoreCopyId} />
              <TouchableOpacity onPress={() => setRestoreNoSaveLater(!restoreNoSaveLater)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.checkbox, restoreNoSaveLater && styles.checkboxChecked, { marginRight: 8, alignItems: 'center', justifyContent: 'center' }]}>
                  {restoreNoSaveLater && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={{ color: '#374151' }}>I do not want to save items for later</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
              <TouchableOpacity
                style={[styles.sdBtnGreen, { flex: 1 }]}
                onPress={() => {
                  if (!restoreTarget) { setIsRestoreOpen(false); return; }
                  // Optionally save current cart as copy
                  if (restoreKeepCopy && !restoreNoSaveLater) {
                    const current = getCartItems();
                    if (current.length > 0) {
                      addSavedCart({ id: restoreCopyId || `UT${Date.now().toString().slice(-8)}`, name: restoreCopyId || `Cart ${new Date().toLocaleString()}`, description: '-', date: new Date().toLocaleString(), items: current });
                    }
                  }
                  // Merge saved cart items into current cart
                  const sc = getSavedCarts().find(c => c.id === restoreTarget.id) || getSavedCartById?.(restoreTarget.id as any);
                  if (sc) {
                    (sc.items || []).forEach(i => addToCart(i.productId, i.quantity || 1));
                  }
                  setCartItems(getCartItems());
                  setActiveTab('bag');
                  setIsRestoreOpen(false);
                  Alert.alert('Restored', 'Saved cart items have been added to your basket.');
                }}
              >
                <Text style={styles.sdBtnText}>Restore</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnWhite, { flex: 1 }]} onPress={() => setIsRestoreOpen(false)}>
                <Text style={styles.btnWhiteText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Save Cart modal */}
      <Modal transparent animationType="fade" visible={isSaveCartOpen} statusBarTranslucent={true} onRequestClose={() => setIsSaveCartOpen(false)}>
        <View style={styles.centerOverlay}>
          <TouchableOpacity style={styles.overlayBg} onPress={() => setIsSaveCartOpen(false)} />
          <View style={[styles.centerPanel, { maxWidth: 520 }]}> 
            <View style={[styles.savedDetailsHeader, { borderBottomColor: '#E0E0E0' }]}> 
              <Text style={[styles.modalTitle, { color: '#fff' }]}>Save Cart</Text>
            </View>
            <View style={{ padding: 12 }}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={[styles.input, { marginBottom: 14 }]}
                placeholder="Enter name"
                value={saveCartName}
                onChangeText={setSaveCartName}
              />
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Enter description"
                value={saveCartDesc}
                onChangeText={setSaveCartDesc}
                multiline
              />
              <TouchableOpacity
                style={[styles.sdBtnGreen, { marginTop: 12 }]}
                onPress={() => {
                  const id = `UT${Date.now().toString().slice(-8)}`;
                  const items = getCartItems();
                  addSavedCart({ id, name: saveCartName || `Cart ${new Date().toLocaleString()}`, description: saveCartDesc || '-', date: new Date().toLocaleString(), items });
                  const stored = getSavedCarts();
                  setSavedCarts(stored.map(sc => ({
                    number: sc.id,
                    date: sc.date,
                    name: sc.name,
                    description: sc.description,
                    quantity: (sc.items || []).reduce((s, i) => s + (i.quantity || 0), 0),
                    total: `${(sc.items || []).reduce((s, c) => s + ((productCatalog[c.productId]?.price || 0) * (c.quantity || 0)), 0).toFixed(2)}€`
                  })));
                  setIsSaveCartOpen(false);
                  Alert.alert('Saved', 'Cart has been saved. You can view it under Saved Carts.');
                }}
              >
                <Text style={styles.sdBtnText}>Save Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Mail Gönder modal */}
      <Modal transparent animationType="fade" visible={isMailOpen} statusBarTranslucent={true} onRequestClose={() => setIsMailOpen(false)}>
        <View style={styles.centerOverlay}>
          <TouchableOpacity style={styles.overlayBg} onPress={() => setIsMailOpen(false)} />
          <View style={[styles.centerPanel, { maxWidth: 520 }]}> 
            <View style={[styles.savedDetailsHeader, { borderBottomColor: '#E0E0E0' }]}> 
              <Text style={[styles.modalTitle, { color: '#fff' }]}>{t('common.sendMail')}</Text>
            </View>
            <View style={{ padding: 12 }}>
              <Text style={styles.label}>{t('common.emailAddresses')}</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                placeholder={t('common.emailAddressesPlaceholder')}
                value={mailTo}
                onChangeText={setMailTo}
                multiline
              />
              <TouchableOpacity style={[styles.sdBtnGreen, { marginTop: 12 }]} onPress={sendMailWithExport}>
                <Text style={styles.sdBtnText}>{t('common.send')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Year selector (2025-2026 only) */}
      <Modal transparent visible={isYearOpen} statusBarTranslucent={true} onRequestClose={() => setIsYearOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsYearOpen(false)} />
        <View style={styles.modalPanel}>
          <Text style={styles.modalTitle}>Year</Text>
          {(['2025', '2026'] as const).map((y) => (
            <TouchableOpacity key={y} style={styles.optionItem} onPress={() => { setYear(y); setIsYearOpen(false); }}>
              <Text style={styles.optionText}>{y}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      {/* Ship-To Party modal (styled like provided HTML) */}
      <Modal transparent visible={isShipToModalOpen} statusBarTranslucent={true} onRequestClose={() => setIsShipToModalOpen(false)}>
        <View style={styles.shipModalBackdrop}>
          <View style={styles.shipModalContent}>
            <View style={styles.shipModalHeader}>
              <Text style={styles.shipModalTitle}>Ship-To Party</Text>
              <TouchableOpacity accessibilityLabel="Close" onPress={() => setIsShipToModalOpen(false)}>
                <Text style={styles.shipModalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.shipModalBody}>
              {/* Filter row */}
              <View style={styles.shipFilterRow}>
                <View style={styles.shipFilterInputWrap}>
                  <TextInput
                    placeholder="Filter"
                    value={shipToPartySearch}
                    onChangeText={setShipToPartySearch}
                    style={styles.shipFilterInput}
                  />
                  <Ionicons name="search" size={18} color="#666" style={styles.shipFilterIcon} />
                </View>
              </View>
              {/* Action buttons */}
              <View style={styles.shipActionRow}>
                <TouchableOpacity style={[styles.shipActionBtn, styles.shipActionBtnBorder]} onPress={() => { /* stub download */ }}>
                  <Text style={styles.shipActionIcon}>📥</Text>
                  <Text style={styles.shipActionText}>Download Excel</Text>
                </TouchableOpacity>
              </View>
              {/* Table */}
              <View style={styles.shipTable}>
                <View style={[styles.shipTableRow, styles.shipTableHeader]}> 
                  <Text style={[styles.shipTh, { flex: 1 }]}>Customer</Text>
                  <Text style={[styles.shipTh, { flex: 2 }]}>Customer Name</Text>
                  <Text style={[styles.shipTh, { width: 80 }]}>{' '}</Text>
                </View>
                <ScrollView style={{ maxHeight: 280 }}>
                  {filteredShipToParties.length === 0 ? (
                    <View style={[styles.shipTableRow, { justifyContent: 'center' }]}> 
                      <Text style={{ color: '#666' }}>No results</Text>
                    </View>
                  ) : (
                    filteredShipToParties.map((p) => (
                      <View key={p.code} style={[styles.shipTableRow, styles.shipTableBodyRow]}> 
                        <Text style={[styles.shipTd, { flex: 1 }]}>{p.code}</Text>
                        <Text style={[styles.shipTd, { flex: 2 }]}>{p.name}</Text>
                        <View style={{ width: 80, alignItems: 'flex-end' }}> 
                          <TouchableOpacity style={styles.shipSelectBtn} onPress={() => { setShipToParty(p.code); setIsShipToModalOpen(false); }}>
                            <Text style={styles.shipSelectText}>Select</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </ScrollView>
              </View>
              {/* Footer info */}
              <View style={styles.shipFooterRow}>
                <Text style={styles.shipFooterText}>Showing 1 to {Math.max(1, filteredShipToParties.length)} of {Math.max(1, filteredShipToParties.length)} entries</Text>
                <View style={styles.shipPaginationChip}><Text style={styles.shipPaginationText}>1</Text></View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Product selector modal - searchable table with Select buttons */}
      <Modal transparent visible={isProductModalOpen} statusBarTranslucent={true} onRequestClose={() => setIsProductModalOpen(false)}>
        <View style={styles.shipModalBackdrop}>
          <View style={[styles.shipModalContent, { maxWidth: 720 }]}> 
            <View style={styles.shipModalHeader}>
              <Text style={styles.shipModalTitle}>Products</Text>
              <TouchableOpacity onPress={() => setIsProductModalOpen(false)}>
                <Text style={styles.shipModalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.prodModalBody}>
              <View style={styles.prodToolbar}>
                <View style={[styles.shipFilterInputWrap, { flex: 1 }]}> 
                  <TextInput
                    placeholder="Filter"
                    value={productSearch}
                    onChangeText={setProductSearch}
                    style={styles.shipFilterInput}
                  />
                  <Ionicons name="search" size={18} color="#666" style={styles.shipFilterIcon} />
                </View>
                <TouchableOpacity style={[styles.shipActionBtn, styles.shipActionBtnBorder]}> 
                  <Text style={styles.shipActionIcon}>📥</Text>
                  <Text style={styles.shipActionText}>Download Excel</Text>
                </TouchableOpacity>
                <View style={styles.prodShowWrap}>
                  <TouchableOpacity style={styles.prodShowBtn} onPress={() => setProductShow((s) => (s === 100 ? 50 : s === 50 ? 25 : 100))}>
                    <Text style={styles.prodShowText}>{productShow}Show</Text>
                    <Text style={{ marginLeft: 6 }}>▾</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.prodTable}>
                <View style={[styles.prodTableRow, styles.prodTableHeader]}> 
                  <Text style={[styles.prodTh, { flex: 2 }]}>Material Name</Text>
                  <Text style={[styles.prodTh, { flex: 1 }]}>Product Code</Text>
                  <Text style={[styles.prodTh, { width: 86 }]}></Text>
                </View>
                <ScrollView style={{ maxHeight: 460 }}>
                  {combinedProductsForModal.map((p) => (
                    <View key={`${p.code}`} style={[styles.prodTableRow, styles.prodTableBodyRow]}> 
                      <Text style={[styles.prodTd, { flex: 2 }]} numberOfLines={1}>
                        {p.name}
                        {p.inCart ? <Text style={styles.inCartPill}>  • In Cart</Text> : null}
                      </Text>
                      <Text style={[styles.prodTd, { flex: 1 }]}>{p.code}</Text>
                      <View style={{ width: 86, alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end' }}> 
                        {p.inCart && (
                          <View style={styles.inCartQtyChip}><Text style={styles.inCartQtyText}>Qty {p.quantity}</Text></View>
                        )}
                        <TouchableOpacity style={[styles.shipSelectBtn, { marginLeft: p.inCart ? 6 : 0 }]} onPress={() => handleSelectProduct({ code: p.code, name: p.name })}>
                          <Text style={styles.shipSelectText}>Select</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Preview modal */}
      <Modal transparent visible={isPreviewOpen} statusBarTranslucent={true} onRequestClose={() => setIsPreviewOpen(false)}>
        <View style={styles.centerOverlay}>
          <TouchableOpacity style={styles.overlayBg} onPress={() => setIsPreviewOpen(false)} />
          <View style={styles.centerPanel}> 
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.modalTitle}>{previewProduct?.name || 'Product'}</Text>
            <TouchableOpacity onPress={() => setIsPreviewOpen(false)}><Text style={{ fontSize: 20, color: '#666' }}>✕</Text></TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            {previewProduct?.image ? (
              <Image source={{ uri: previewProduct.image }} style={{ width: 120, height: 120, borderRadius: 8 }} />
            ) : (
              <View style={{ width: 120, height: 120, borderRadius: 8, backgroundColor: '#E5E7EB' }} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#666', marginBottom: 6 }}>{previewProduct?.code}</Text>
              <Text style={{ color: '#333' }}>Ready for ordering. Price TBD</Text>
            </View>
            <View style={{ width: 90, height: 90, backgroundColor: '#F5F5F5', borderRadius: 8 }} />
          </View>
          <TouchableOpacity style={[styles.btnWhite, { marginTop: 12 }]} onPress={() => previewProduct?.code && navigateToProductDetail(previewProduct.code)}>
            <Text style={styles.btnWhiteText}>Details</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Saved Cart Details (full screen modal) */}
      <Modal transparent animationType="slide" visible={isSavedDetailsOpen} statusBarTranslucent={true} onRequestClose={() => setIsSavedDetailsOpen(false)}>
        <View style={styles.savedDetailsOverlay}>
          <View style={styles.savedDetailsPanel}>
            <View style={styles.savedDetailsHeader}>
              <TouchableOpacity onPress={() => setIsSavedDetailsOpen(false)} style={styles.backBtn}>
                <Text style={styles.backBtnText}>‹ Back to Saved Carts</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={styles.savedDetailsBox}>
                <View style={styles.savedDetailsBoxHeader}>
                  <Text style={styles.detailsNumber}>{savedDetails?.number || '-'}</Text>
                  <Text style={styles.detailsDate}>{savedDetails?.date || ''}</Text>
                </View>
                <View style={styles.savedDetailsBoxBottom}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailsTitle}>{savedDetails?.name || 'Saved Cart'}</Text>
                    {!!savedDetails?.description && <Text style={styles.detailsDesc}>{savedDetails?.description}</Text>}
                    <View style={styles.detailsInfoRow}>
                      <View style={styles.detailsCircle}>
                        <Ionicons name="cart" size={16} color="#2E7D32" />
                      </View>
                      <View>
                        <Text style={styles.detailsQty}>{(savedDetails?.items || []).reduce((s, i) => s + (i.qty || 0), 0)} item(s)</Text>
                        <Text style={styles.detailsTotal}>{savedDetails?.total || ''}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                {/* Action buttons */}
                <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
                  <TouchableOpacity style={styles.sdBtnGray} onPress={() => {
                    if (!savedDetails) return;
                    setDeleteTarget({ id: savedDetails.number, name: savedDetails.name, count: (savedDetails.items || []).length });
                    setIsDeleteOpen(true);
                  }}>
                    <Text style={styles.sdBtnText}>Delete Cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sdBtnOrange} onPress={() => {
                    if (!savedDetails) return;
                    setEditId(savedDetails.number);
                    setEditName(savedDetails.name);
                    setEditDesc(savedDetails.description || '');
                    setIsEditOpen(true);
                  }}>
                    <Text style={styles.sdBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.sdBtnGreen}
                    onPress={() => {
                      if (!savedDetails) return;
                      setRestoreTarget({ id: savedDetails.number, name: savedDetails.name, count: (savedDetails.items || []).length });
                      setRestoreCopyId(String(Date.now()));
                      setRestoreKeepCopy(true);
                      setRestoreNoSaveLater(false);
                      setIsRestoreOpen(true);
                    }}
                  >
                    <Text style={styles.sdBtnText}>Restore</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {(savedDetails?.items || []).length === 0 ? (
                <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Text style={{ color: '#666' }}>No items in this saved cart.</Text>
                </View>
              ) : (
                (savedDetails?.items || []).map((it) => {
                  const prod = productCatalog[it.code] || { name: `Product ${it.code}` };
                  const price = productCatalog[it.code]?.price ?? 0;
                  const total = (price || 0) * (it.qty || 0);
                  return (
                    <View key={`sd-${it.code}`} style={styles.savedLine}>
                      <View style={styles.savedLineLeft}> 
                        {productCatalog[it.code]?.image ? (
                          <Image source={{ uri: productCatalog[it.code]!.image }} style={styles.savedThumb} />
                        ) : (
                          <View style={styles.savedThumb} />
                        )}
                      </View>
                      <View style={[styles.savedLineInfo, { paddingRight: 8 }]}> 
                        {/* Brand (logo) */}
                        <Image source={require('../../assets/lassa_logo.png')} style={{ width: 80, height: 14, marginBottom: 6 }} resizeMode="contain" />
                        {/* Product name */}
                        <Text style={styles.savedLineNameLink} onPress={() => navigateToProductDetail(it.code)}>{prod.name}</Text>
                        <Text style={styles.savedLineCode}>{it.code}</Text>
                        {/* Metrics under the title */}
                        <View style={styles.savedMetricsRow}>
                          <View style={styles.savedMetricBlock}>
                            <Text style={styles.savedColTitle}>Amount</Text>
                            <Text style={styles.savedColValue}>{price ? formatCurrency(price) : '-'}</Text>
                          </View>
                          <View style={styles.savedMetricBlock}>
                            <Text style={styles.savedColTitle}>Quantity</Text>
                            <Text style={styles.savedColValue}>{it.qty}</Text>
                          </View>
                          <View style={styles.savedMetricBlock}>
                            <Text style={styles.savedColTitle}>Total</Text>
                            <Text style={styles.savedColValue}>{price ? formatCurrency(total) : 'FREE'}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <BottomNavigation
        isReportsModalOpen={isReportsModalOpen}
        setIsReportsModalOpen={setIsReportsModalOpen}
        onNavigateToReport={() => {}}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8',height: 'auto' },
  scroll: { flex: 1 },
  title: { fontSize: 22, fontWeight: '700', color: '#333', marginHorizontal: 16, marginTop: 12, marginBottom: 8, fontFamily: 'MuseoSans-Bold' },
  tabsRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 8, marginBottom: 8 },
  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginTop: 8, marginBottom: 8 },
  breadcrumbLink: { color: '#0a58ca', textDecorationLine: 'underline', fontSize: 13 },
  breadcrumbSep: { marginHorizontal: 6, color: '#9CA3AF' },
  breadcrumbCurrent: { color: '#6B7280', fontSize: 13 },
  tabBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#F3F4F6', borderRadius: 8, marginRight: 8 },
  tabBtnActive: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB' },
  tabText: { color: '#666' },
  tabTextActive: { color: '#D53439', fontWeight: '700' },
  card: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2, overflow: 'hidden' },
  formRow: { flexDirection: 'column', gap: 10 },
  formColHalf: { flexBasis: '48%' },
  formColFull: { flexBasis: '100%' },
  formCol: { flex: 1 },
  label: { color: '#333', fontSize: 14, height: 'auto', marginBottom: 6, fontFamily: 'MuseoSans-Medium', fontWeight: '600' },
  select: { borderWidth: 1, borderColor: '#D0D5DD', marginBottom:10, borderRadius: 6, height: 40, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#fff' },
  selectText: { color: '#333' },
  input: { borderWidth: 1, borderColor: '#D0D5DD', marginBottom:10, borderRadius: 6, paddingHorizontal: 10, height: 40, backgroundColor: '#fff', color: '#333', width: '100%' },
  inputDisabled: { backgroundColor: '#ECEFF1', color: '#455A64' },
  textarea: { minHeight: 150, textAlignVertical: 'top', width: '100%', height:140, maxWidth: '100%' },
  inlineGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inlineGroupTight: { gap: 0 },
  fieldGroupSpacing: { marginBottom: 10 },
  searchBtn: { backgroundColor: '#F4A261', width: 48, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '600' },
  searchBtnOrange: { backgroundColor: '#F59E0B', height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, marginLeft: 8 },
  searchBtnOrangeSm: { backgroundColor: '#F59E0B', height: 34, width: 34, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  searchBtnXS: { backgroundColor: '#F59E0B', height: 34, width: 28, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginLeft: 0 },

  actions: { flexDirection: 'column', gap: 10, paddingHorizontal: 16, marginTop: 12 },
  actionBtn: { height: 48, borderRadius: 8, borderWidth: 1, borderColor: '#4CAF50', alignItems: 'center', justifyContent: 'center', width: '100%' },
  actionBtnText: { color: '#4CAF50', fontWeight: '600', textAlign: 'center' },
  primary: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  primaryText: { color: '#fff' },
  secondary: { backgroundColor: '#fff' },
  primaryHollow: { backgroundColor: '#fff', borderColor: '#4CAF50' },
  disabledBtn: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  actionContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  actionIcon: { marginRight: 10 },

  rowCard: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 10, padding: 12, marginTop: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  rowTitle: { fontWeight: '700', color: '#333', marginBottom: 8 },
  identifierText: { color: '#666', marginTop: 6 },

  addRowBox: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, marginBottom: 24 },
  addRowBtn: { backgroundColor: '#EEE', paddingHorizontal: 14, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addRowBtnText: { color: '#333', fontWeight: '600' },

  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' },
  modalPanel: { position: 'absolute', left: '2.5%', right: '2.5%', bottom: '10%', backgroundColor: '#fff', borderRadius: 12, padding: 14 },
  centerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  overlayBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.35)' },
  centerPanel: { width: '92%', backgroundColor: '#fff', borderRadius: 12, padding: 14 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  optionItem: { paddingVertical: 10, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  optionText: { color: '#333', fontSize: 14 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCard: { width: '48%', backgroundColor: '#FAFAFA', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  gridName: { color: '#333', fontWeight: '600' },
  gridCode: { color: '#666', marginTop: 6, marginBottom: 10 },
  gridSelectBtn: { backgroundColor: '#4CAF50', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  gridSelectText: { color: '#fff', fontWeight: '600' },
  cartItemCard: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 10, padding: 12, marginTop: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  cartItemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cartItemCode: { color: '#333', fontWeight: '700' },
  cartItemName: { color: '#666', marginTop: 2 },
  tableWrap: { marginTop: 16, backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 8, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10 },
  tableHeaderRow: { backgroundColor: '#F6F7F9', borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  tableBodyRow: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  thCell: { color: '#6B7280', fontWeight: '700', fontSize: 12 },
  tdCell: { justifyContent: 'center' },
  tableScroll: { paddingRight: 16 },
  tableFixedWidth: { width: 900 },
  tableInput: { height: 34, paddingVertical: 0 },
  joinedInput: { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
  joinedSearch: { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: 0 },
  tableAddRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#fff', marginHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tableAddCell: { justifyContent: 'center' },
  codeText: { color: '#374151', fontWeight: '600' },
  linkText: { color: '#0a58ca', textDecorationLine: 'underline' },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#CBD5E0', backgroundColor: '#fff' },
  checkboxChecked: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  thumb: { width: 32, height: 32, borderRadius: 6, backgroundColor: '#E5E7EB' },
  thumbImg: { width: 32, height: 32, borderRadius: 6, resizeMode: 'cover' },
  qtyInputWrap: { position: 'relative', justifyContent: 'center' },
  unitInside: { position: 'absolute', right: 4, color: '#666', fontSize: 11, fontWeight: '600' },
  bottomTableControls: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 12, gap: 8 },
  summaryCard: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 12 },
  summaryTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  summaryRowSplit: { flexDirection: 'row', alignItems: 'stretch', backgroundColor: '#fff' },
  summaryCell: { flex: 1, paddingVertical: 8, paddingHorizontal: 10 },
  summaryCellLeft: {},
  summaryCellRight: {},
  summaryDivider: { width: 1, backgroundColor: '#E5E7EB', marginVertical: 4 },
  summaryMetricLabel: { color: '#D53439', fontWeight: '700', marginBottom: 6 },
  summaryMetricValue: { color: '#111827', fontWeight: '800', fontSize: 20 },
  summaryMetricUnit: { color: '#666', fontWeight: '600', fontSize: 12 },
  summaryGrossRow: { borderTopWidth: 1, borderTopColor: '#E5E7EB', marginTop: 10, paddingTop: 10 },
  summaryGrossLabel: { color: '#D53439', fontWeight: '700', marginBottom: 6 },
  summaryGrossValue: { color: '#111827', fontWeight: '800', fontSize: 20 },
  netCard: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 16, borderRadius: 12, padding: 12, marginBottom: 24 },
  netLabel: { color: '#D53439', fontWeight: '700' },
  netValue: { fontSize: 28, color: '#111827', fontWeight: '800' },
  buyNowBtn: { backgroundColor: '#4CAF50', height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buyNowText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  // Cart view toggle
  viewToggleBtn: { paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, marginLeft: 8, backgroundColor: '#fff' },
  viewToggleActive: { backgroundColor: '#F0F0F0', borderColor: '#D1D5DB' },
  viewToggleText: { color: '#6B7280', fontWeight: '600' },
  viewToggleTextActive: { color: '#0066CC' },
  // Grid (PLP-like) styles
  cartGrid: { flexDirection: 'column', gap: 12, paddingHorizontal: 12, marginTop: 12 },
  cartGridCard: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#EEE' },
  cartGridHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cartGridTitleBlock: { flex: 1, paddingRight: 8 },
  cartGridName: { fontSize: 14, fontWeight: '700', color: '#333' },
  cartGridId: { fontSize: 11, color: '#777', marginTop: 2 },
  cartGridPrice: { fontSize: 16, fontWeight: '700', color: '#333', textAlign: 'right' },
  cartGridLineAmount: { fontSize: 12, color: '#666', textAlign: 'right', marginTop: 2 },
  cartGridBody: { marginTop: 10 },
  cartGridImage: { width: '100%', height: 120, borderRadius: 10, backgroundColor: '#E5E7EB' },
  cartGridImagePlaceholder: { width: '100%', height: 120, borderRadius: 10, backgroundColor: '#E5E7EB' },
  cartGridActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  qtySelector: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 34, height: 34, borderRadius: 6, borderWidth: 1, borderColor: '#E6E6E6', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  qtyBtnText: { color: '#4CAF50', fontWeight: '700', fontSize: 16 },
  qtyInput: { width: 56, height: 34, borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 6, textAlign: 'center', textAlignVertical: 'center', marginHorizontal: 6, color: '#333', paddingVertical: 0 },
  removeBtn: { paddingVertical: 8, paddingHorizontal: 10, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 },
  removeBtnText: { color: '#D53439', fontWeight: '700' },
  // Saved carts
  savedCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#EEE', marginBottom: 12 },
  savedHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  savedNumber: { color: '#374151', fontWeight: '700' },
  savedDate: { color: '#6B7280', fontSize: 12 },
  savedName: { color: '#111827', fontWeight: '600' },
  savedDesc: { color: '#6B7280', marginTop: 2 },
  savedInfoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  savedInfoPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16 },
  savedInfoText: { color: '#2E7D32', fontSize: 12 },
  savedTotal: { color: '#111', fontWeight: '700' },
  savedFooter: { flexDirection: 'row', gap: 8, marginTop: 10 },
  savedBtn: { flex: 1, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  savedBtnGray: { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB' },
  savedBtnGreen: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  savedBtnTextGray: { color: '#374151', fontWeight: '600' },
  savedBtnTextGreen: { color: '#fff', fontWeight: '700' },
  // Ship-To styled modal
  shipModalBackdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  shipModalContent: { width: '95%', maxWidth: 520, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' },
  shipModalHeader: { backgroundColor: '#478B57', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  shipModalTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  shipModalClose: { color: '#fff', fontSize: 18 },
  shipModalBody: { padding: 12 },
  shipFilterRow: { marginBottom: 10 },
  shipFilterInputWrap: { position: 'relative' },
  shipFilterInput: { borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 6, height: 40, backgroundColor: '#fff', paddingHorizontal: 12, paddingRight: 36 },
  shipFilterIcon: { position: 'absolute', right: 10, top: 11 },
  shipActionRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  shipActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  shipActionBtnBorder: { borderWidth: 1, borderColor: '#D9D9D9', backgroundColor: '#fff' },
  shipActionIcon: { fontSize: 14 },
  shipActionText: { fontWeight: '700', color: '#333' },
  shipTable: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff' },
  shipTableHeader: { backgroundColor: '#F0F0F0' },
  shipTableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10 },
  shipTh: { fontWeight: '700', color: '#333' },
  shipTd: { color: '#333' },
  shipTableBodyRow: { borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  shipSelectBtn: { backgroundColor: '#E6F4EA', borderColor: '#2E7D32', borderWidth: 1, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  shipSelectText: { color: '#2E7D32', fontWeight: '700' },
  shipFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 6, paddingVertical: 10 },
  shipFooterText: { color: '#333' },
  shipPaginationChip: { borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  shipPaginationText: { color: '#D53439', fontWeight: '700' },
  // Product modal (table)
  prodModalBody: { padding: 12 },
  prodToolbar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  prodShowWrap: {},
  prodShowBtn: { borderWidth: 1, borderColor: '#D9D9D9', backgroundColor: '#fff', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 8, flexDirection: 'row', alignItems: 'center' },
  prodShowText: { color: '#333', fontWeight: '700' },
  prodTable: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff' },
  prodTableHeader: { backgroundColor: '#F0F0F0' },
  prodTableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10 },
  prodTh: { fontWeight: '700', color: '#333' },
  prodTd: { color: '#333' },
  prodTableBodyRow: { borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  // Saved details modal
  savedDetailsOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  savedDetailsPanel: { width: '96%', maxWidth: 860, backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', height: '85%' },
  savedDetailsHeader: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#EEE', backgroundColor: '#478B57' },
  backBtn: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#F3F4F6', borderRadius: 6, alignSelf: 'flex-start' },
  backBtnText: { color: '#333', fontWeight: '700' },
  savedDetailsBox: { margin: 12, borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 8, overflow: 'hidden', backgroundColor: '#FFFFFF' },
  savedDetailsBoxHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EDEDED', backgroundColor: '#FFFFFF' },
  detailsNumber: { fontWeight: '700', color: '#333' },
  detailsDate: { color: '#666' },
  savedDetailsBoxBottom: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  detailsTitle: { fontWeight: '700', fontSize: 16, color: '#333' },
  detailsDesc: { color: '#666', marginTop: 4 },
  detailsInfoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  detailsCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E6F4EA', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  detailsQty: { color: '#333', fontWeight: '700' },
  detailsTotal: { color: '#333' },
  savedLine: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EDEDED', backgroundColor: '#FFFFFF' },
  savedLineLeft: { width: 50, alignItems: 'center', justifyContent: 'center' },
  savedThumb: { width: 40, height: 40, borderRadius: 4, backgroundColor: '#E5E7EB' },
  savedLineInfo: { flex: 1, paddingHorizontal: 8 },
  savedLineName: { color: '#333', fontWeight: '700' },
  savedLineNameLink: { color: '#0066CC', fontWeight: '700', textDecorationLine: 'underline' },
  savedLineCode: { color: '#666', marginTop: 2 },
  savedLineCol: { width: 90, alignItems: 'flex-start' },
  savedColTitle: { color: '#6B7280', fontSize: 12 },
  savedColValue: { color: '#111827', fontWeight: '700', marginTop: 2 },
  savedMetricsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  savedMetricBlock: { minWidth: 90, marginRight: 16 },
  sdBtnGray: { backgroundColor: '#B0B0B0', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  sdBtnOrange: { backgroundColor: '#E2B33C', paddingVertical: 12, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  sdBtnGreen: { backgroundColor: '#4CAF50', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  sdBtnText: { color: '#fff', fontWeight: '700' },
  btnWhite: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0E0E0', paddingVertical: 12, borderRadius: 6, alignItems: 'center' },
  btnWhiteText: { color: '#666666', fontWeight: '700' },
  inCartPill: { color: '#2E7D32', fontWeight: '700', fontSize: 12 },
  inCartQtyChip: { backgroundColor: '#E6F4EA', borderColor: '#2E7D32', borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  inCartQtyText: { color: '#2E7D32', fontWeight: '700', fontSize: 11 },
});

export default CartScreen;


