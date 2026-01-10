import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { VendorsModule } from './vendors/vendors.module';
import { PurchaseRequisitionsModule } from './purchase-requisitions/purchase-requisitions.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { GoodsReceiptNotesModule } from './goods-receipt-notes/goods-receipt-notes.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { RawMaterialsModule } from './raw-materials/raw-materials.module';
import { FinishedGoodsModule } from './finished-goods/finished-goods.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { CustomersModule } from './customers/customers.module';
import { SalesModule } from './sales/sales.module';
import { DepartmentsModule } from './hrm/departments/departments.module';
import { DesignationsModule } from './hrm/designations/designations.module';
import { EmployeesModule } from './hrm/employees/employees.module';
import { AttendanceModule } from './hrm/attendance/attendance.module';
import { LeavesModule } from './hrm/leaves/leaves.module';
import { PayrollModule } from './hrm/payroll/payroll.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, VendorsModule, PurchaseRequisitionsModule, PurchaseOrdersModule, GoodsReceiptNotesModule, InvoicesModule, PaymentsModule, RawMaterialsModule, FinishedGoodsModule, WarehousesModule, CustomersModule, SalesModule, DepartmentsModule, DesignationsModule, EmployeesModule, AttendanceModule, LeavesModule, PayrollModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
