import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Eye, Users, Calendar, CreditCard, User, CheckCircle, Clock, AlertCircle } from "lucide-react";

// Mock data for demonstration
const TEAM_OPTIONS = [
  { id: "accounting", name: "Accounting Team", color: "bg-blue-500" },
  { id: "designing", name: "Designing Team", color: "bg-purple-500" },
  { id: "quality", name: "Quality Check", color: "bg-orange-500" },
  { id: "production", name: "Production Team", color: "bg-green-500" },
  { id: "delivery", name: "Delivery Team", color: "bg-red-500" },
];

const MOCK_TEAM_MEMBERS = {
  accounting: [
    { _id: "1", name: "Alice Johnson", email: "alice@company.com" },
    { _id: "2", name: "Bob Smith", email: "bob@company.com" },
  ],
  designing: [
    { _id: "3", name: "Carol Davis", email: "carol@company.com" },
    { _id: "4", name: "David Wilson", email: "david@company.com" },
  ],
  quality: [
    { _id: "5", name: "Eve Brown", email: "eve@company.com" },
    { _id: "6", name: "Frank Miller", email: "frank@company.com" },
  ],
  production: [
    { _id: "7", name: "Grace Lee", email: "grace@company.com" },
    { _id: "8", name: "Henry Taylor", email: "henry@company.com" },
  ],
  delivery: [
    { _id: "9", name: "Ivy Chen", email: "ivy@company.com" },
    { _id: "10", name: "Jack Anderson", email: "jack@company.com" },
  ],
};

const MOCK_ORDERS = [
  {
    _id: "ORD001",
    invoice_no: "INV-2024-001",
    total_price: 2499.99,
    team_status: "accounting",
    assigned_member: "Alice Johnson",
    payment_type: "online",
    createdAt: "2024-01-15T10:30:00Z",
    user_details: [{ name: "John Doe", email: "john@example.com" }],
    delivery_address: { mobile_number: "+1234567890" },
    cart_items: { product_name: "Premium Widget", product_quantity: 2, product_price: 1249.99 },
    status: "in_progress"
  },
  {
    _id: "ORD002",
    invoice_no: "INV-2024-002",
    total_price: 1899.50,
    team_status: "designing",
    assigned_member: "Carol Davis",
    payment_type: "cod",
    createdAt: "2024-01-14T14:20:00Z",
    user_details: [{ name: "Jane Smith", email: "jane@example.com" }],
    delivery_address: { mobile_number: "+1234567891" },
    cart_items: { product_name: "Custom Design Package", product_quantity: 1, product_price: 1899.50 },
    status: "completed"
  },
  {
    _id: "ORD003",
    invoice_no: "INV-2024-003",
    total_price: 750.00,
    team_status: null,
    assigned_member: null,
    payment_type: "online",
    createdAt: "2024-01-16T09:15:00Z",
    user_details: [{ name: "Mike Johnson", email: "mike@example.com" }],
    delivery_address: { mobile_number: "+1234567892" },
    cart_items: { product_name: "Standard Service", product_quantity: 3, product_price: 250.00 },
    status: "pending"
  },
];

interface Order {
  _id: string;
  invoice_no: string;
  total_price: number;
  team_status: string | null;
  assigned_member: string | null;
  payment_type: string;
  createdAt: string;
  user_details: Array<{ name: string; email: string }>;
  delivery_address: { mobile_number: string };
  cart_items: { product_name: string; product_quantity: number; product_price: number };
  status: string;
}

const OrderAssignment = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Array<{ _id: string; name: string; email: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const { toast } = useToast();

  // Filter orders based on search term
  useEffect(() => {
    const filtered = orders.filter(order =>
      order.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_details[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cart_items.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleTeamSelection = (teamId: string, orderId: string) => {
    setSelectedTeam(teamId);
    setSelectedOrder(orderId);
    setTeamMembers(MOCK_TEAM_MEMBERS[teamId] || []);
    setIsAssignDialogOpen(true);
  };

  const handleMemberAssignment = async (memberId: string, memberName: string) => {
    if (!selectedOrder || !selectedTeam) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the order with assignment
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === selectedOrder
            ? { ...order, team_status: selectedTeam, assigned_member: memberName, status: "in_progress" }
            : order
        )
      );

      toast({
        title: "Assignment Successful",
        description: `Order ${selectedOrder} has been assigned to ${memberName}`,
        variant: "default",
      });

      setIsAssignDialogOpen(false);
      setSelectedOrder(null);
      setSelectedTeam("");
      setTeamMembers([]);
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Failed to assign order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success text-success-foreground";
      case "in_progress": return "bg-warning text-warning-foreground";
      case "pending": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "in_progress": return <Clock className="h-4 w-4" />;
      case "pending": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTeamInfo = (teamId: string | null) => {
    if (!teamId) return null;
    return TEAM_OPTIONS.find(team => team.id === teamId);
  };

  const handleExportData = () => {
    // Simulate export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Order ID,Invoice No,Amount,Team,Member,Status,Customer,Date\n" +
      filteredOrders.map(order => 
        `${order._id},${order.invoice_no},${order.total_price},${order.team_status || 'Unassigned'},${order.assigned_member || 'None'},${order.status},${order.user_details[0]?.name},${new Date(order.createdAt).toLocaleDateString()}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Orders data has been exported successfully",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Order Assignment Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Efficiently manage and assign orders to your team members across different departments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-primary/10 to-primary-glow/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{orders.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {orders.filter(o => o.status === "completed").length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {orders.filter(o => o.status === "in_progress").length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {orders.filter(o => !o.team_status).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>Search, filter, and manage order assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders by invoice, customer, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="success" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const teamInfo = getTeamInfo(order.team_status);
                    return (
                      <TableRow key={order._id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{order.invoice_no}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{order.user_details[0]?.name}</div>
                            <div className="text-sm text-muted-foreground">{order.delivery_address.mobile_number}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{order.cart_items.product_name}</div>
                            <div className="text-sm text-muted-foreground">Qty: {order.cart_items.product_quantity}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-primary">₹{order.total_price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                            {getStatusIcon(order.status)}
                            {order.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {teamInfo ? (
                            <Badge variant="outline" className="border-primary/30 text-primary">
                              {teamInfo.name}
                            </Badge>
                          ) : (
                            <Select onValueChange={(value) => handleTeamSelection(value, order._id)}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Assign Team" />
                              </SelectTrigger>
                              <SelectContent>
                                {TEAM_OPTIONS.map((team) => (
                                  <SelectItem key={team.id} value={team.id}>
                                    {team.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </TableCell>
                        <TableCell>
                          {order.assigned_member ? (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{order.assigned_member}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Not assigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.payment_type === "online" ? "default" : "secondary"}>
                            <CreditCard className="h-3 w-3 mr-1" />
                            {order.payment_type === "online" ? "Online" : "COD"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Team Member</DialogTitle>
              <DialogDescription>
                Select a team member to assign this order to.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.email}</div>
                  </div>
                  <Button
                    onClick={() => handleMemberAssignment(member._id, member.name)}
                    disabled={loading}
                    size="sm"
                  >
                    {loading ? "Assigning..." : "Assign"}
                  </Button>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrderAssignment;