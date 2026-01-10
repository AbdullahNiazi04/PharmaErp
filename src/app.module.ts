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

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, VendorsModule, PurchaseRequisitionsModule, PurchaseOrdersModule, GoodsReceiptNotesModule, InvoicesModule, PaymentsModule, RawMaterialsModule, FinishedGoodsModule, WarehousesModule, CustomersModule, SalesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
