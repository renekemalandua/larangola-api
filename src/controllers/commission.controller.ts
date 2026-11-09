import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  Query,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { AdminGuard } from '../shared/guards/admin.guard';
import { IUploadService } from '../shared/services/IUploadService';
import {
  CloseDealAndCalculateCommissionUseCase,
  GetCommissionStatsUseCase,
  GetCommissionHistoryUseCase,
  AdvanceDealStageUseCase,
  SendBankDetailsUseCase,
  ClientSubmitReceiptUseCase,
  AgentConfirmDealUseCase,
  AgentSubmitFeeReceiptUseCase,
  AdminReviewFeeUseCase,
  CreateAgentBankAccountUseCase,
  ListAgentBankAccountsUseCase,
  SetFavoriteBankAccountUseCase,
  DeleteAgentBankAccountUseCase,
  ListPendingFeesUseCase,
  GetDealDetailsUseCase,
  AdminListAllDealsUseCase,
  GetDealByPropertyAndClientUseCase,
} from '../usecases/commission.usecases';
import { ClosedDealAdapter, AgentBankAccountAdapter } from '../adapters/closed-deal.adapter';

@ApiTags('Commissions & Deals')
@Controller('commissions')
export class CommissionController {
  constructor(
    private readonly closeDealUseCase: CloseDealAndCalculateCommissionUseCase,
    private readonly getStatsUseCase: GetCommissionStatsUseCase,
    private readonly getHistoryUseCase: GetCommissionHistoryUseCase,
    private readonly advanceStageUseCase: AdvanceDealStageUseCase,
    private readonly sendBankDetailsUseCase: SendBankDetailsUseCase,
    private readonly clientSubmitReceiptUseCase: ClientSubmitReceiptUseCase,
    private readonly agentConfirmDealUseCase: AgentConfirmDealUseCase,
    private readonly agentSubmitFeeReceiptUseCase: AgentSubmitFeeReceiptUseCase,
    private readonly adminReviewFeeUseCase: AdminReviewFeeUseCase,
    private readonly createBankAccountUseCase: CreateAgentBankAccountUseCase,
    private readonly listBankAccountsUseCase: ListAgentBankAccountsUseCase,
    private readonly setFavoriteBankAccountUseCase: SetFavoriteBankAccountUseCase,
    private readonly deleteBankAccountUseCase: DeleteAgentBankAccountUseCase,
    private readonly listPendingFeesUseCase: ListPendingFeesUseCase,
    private readonly getDealDetailsUseCase: GetDealDetailsUseCase,
    private readonly adminListAllDealsUseCase: AdminListAllDealsUseCase,
    private readonly getDealByPropertyUseCase: GetDealByPropertyAndClientUseCase,
    private readonly uploadService: IUploadService
  ) {}

  // ----------------------------------------------------
  // DEAL PIPELINE
  // ----------------------------------------------------

  @Post('deals/advance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Advance or create a deal stage in pipeline' })
  async advanceStage(@Req() req: any, @Body() body: any) {
    if (!req.user || !req.user.id) throw new BadRequestException('Não autenticado');
    const result = await this.advanceStageUseCase.execute({
      dealId: body.dealId,
      propertyId: body.propertyId,
      clientId: body.clientId || req.user.id,
      userId: req.user.id,
      stage: body.stage,
      dealAmount: body.dealAmount ? Number(body.dealAmount) : undefined,
      dealType: body.dealType,
    });
    return ClosedDealAdapter.toHttp(result);
  }

  @Post('deals/:id/bank-details')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agent sends payment coordinates for a deal' })
  async sendBankDetails(
    @Req() req: any,
    @Param('id') dealId: string,
    @Body() body: { bankName: string; iban: string; accountHolder: string; isOwnerAccount?: boolean }
  ) {
    if (!req.user || !req.user.id) throw new BadRequestException('Não autenticado');
    const result = await this.sendBankDetailsUseCase.execute({
      dealId,
      userId: req.user.id,
      bankName: body.bankName,
      iban: body.iban,
      accountHolder: body.accountHolder,
      isOwnerAccount: body.isOwnerAccount,
    });
    return ClosedDealAdapter.toHttp(result);
  }

  @Post('deals/:id/client-receipt')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('receipt'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Client submits bank transfer proof of payment' })
  async clientSubmitReceipt(
    @Req() req: any,
    @Param('id') dealId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { note?: string }
  ) {
    if (!req.user || !req.user.id) throw new BadRequestException('Não autenticado');
    if (!file) throw new BadRequestException('Comprovativo de pagamento é obrigatório');

    const receiptUrl = await this.uploadService.uploadImage('deals/client-receipts', file);
    const result = await this.clientSubmitReceiptUseCase.execute({
      dealId,
      userId: req.user.id,
      receiptUrl,
      note: body.note,
    });
    return ClosedDealAdapter.toHttp(result);
  }

  @Post('deals/:id/confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agent confirms deal after verifying client receipt' })
  async agentConfirmDeal(@Req() req: any, @Param('id') dealId: string) {
    if (!req.user || !req.user.id) throw new BadRequestException('Não autenticado');
    const result = await this.agentConfirmDealUseCase.execute({
      dealId,
      userId: req.user.id,
    });
    return ClosedDealAdapter.toHttp(result);
  }

  @Post('deals/:id/fee-receipt')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('receipt'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Agent submits 20% platform commission fee proof' })
  async agentSubmitFeeReceipt(
    @Req() req: any,
    @Param('id') dealId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!req.user || !req.user.id) throw new BadRequestException('Não autenticado');
    if (!file) throw new BadRequestException('Comprovativo da taxa de comissão é obrigatório');

    const receiptUrl = await this.uploadService.uploadImage('deals/platform-fees', file);
    const result = await this.agentSubmitFeeReceiptUseCase.execute({
      dealId,
      userId: req.user.id,
      receiptUrl,
    });
    return ClosedDealAdapter.toHttp(result);
  }

  @Get('deals/by-property/:propertyId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get active deal for property and client/agent' })
  async getDealByProperty(
    @Req() req: any,
    @Param('propertyId') propertyId: string,
    @Query('clientId') queryClientId?: string
  ) {
    if (!req.user || !req.user.id) throw new BadRequestException('Não autenticado');
    const clientId = queryClientId || req.user.id;
    const deal = await this.getDealByPropertyUseCase.execute(propertyId, clientId);
    if (!deal) return null;
    return ClosedDealAdapter.toHttp(deal);
  }

  @Get('deals/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get deal details with property information' })
  async getDealDetails(@Param('id') dealId: string) {
    const { deal, property } = await this.getDealDetailsUseCase.execute(dealId);
    return {
      deal: ClosedDealAdapter.toHttp(deal),
      property,
    };
  }

  @Get('agent/pending-fees')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List closed deals with pending 20% platform fee for agent' })
  async listPendingFees(@Req() req: any) {
    if (!req.user || !req.user.id) throw new BadRequestException('Não autenticado');
    return this.listPendingFeesUseCase.execute(req.user.id);
  }

  // ----------------------------------------------------
  // AGENT BANK ACCOUNTS
  // ----------------------------------------------------

  @Post('bank-accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new bank account coordinate for the agent' })
  async createBankAccount(
    @Req() req: any,
    @Body() body: { bankName: string; iban: string; accountHolder: string; isFavorite?: boolean }
  ) {
    if (!req.user || !req.user.id) throw new BadRequestException('Não autenticado');
    const result = await this.createBankAccountUseCase.execute({
      userId: req.user.id,
      bankName: body.bankName,
      iban: body.iban,
      accountHolder: body.accountHolder,
      isFavorite: body.isFavorite,
    });
    return AgentBankAccountAdapter.toHttp(result);
  }

  @Get('bank-accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List saved bank accounts of the authenticated agent' })
  async listBankAccounts(@Req() req: any) {
    if (!req.user || !req.user.id) throw new BadRequestException('Não autenticado');
    const list = await this.listBankAccountsUseCase.execute(req.user.id);
    return list.map(AgentBankAccountAdapter.toHttp);
  }

  @Patch('bank-accounts/:id/favorite')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set bank account as favorite' })
  async setFavoriteBankAccount(@Req() req: any, @Param('id') accountId: string) {
    if (!req.user || !req.user.id) throw new BadRequestException('Não autenticado');
    const result = await this.setFavoriteBankAccountUseCase.execute(req.user.id, accountId);
    return AgentBankAccountAdapter.toHttp(result);
  }

  @Delete('bank-accounts/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a saved bank account' })
  async deleteBankAccount(@Req() req: any, @Param('id') accountId: string) {
    if (!req.user || !req.user.id) throw new BadRequestException('Não autenticado');
    await this.deleteBankAccountUseCase.execute(req.user.id, accountId);
    return { success: true };
  }

  // ----------------------------------------------------
  // ADMIN AUDIT
  // ----------------------------------------------------

  @Get('admin/deals')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: list all deals in platform with fees and stages' })
  async adminListAllDeals() {
    return this.adminListAllDealsUseCase.execute();
  }

  @Post('admin/deals/:id/review-fee')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: approve or reject agent 20% platform fee receipt' })
  async adminReviewFee(
    @Req() req: any,
    @Param('id') dealId: string,
    @Body() body: { approved: boolean; rejectionReason?: string }
  ) {
    const result = await this.adminReviewFeeUseCase.execute({
      dealId,
      adminUserId: req.user.id,
      approved: body.approved,
      rejectionReason: body.rejectionReason,
    });
    return ClosedDealAdapter.toHttp(result);
  }

  // ----------------------------------------------------
  // LEGACY / STATS
  // ----------------------------------------------------

  @Post('close-deal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark property as closed and record commission' })
  async closeDeal(@Req() req: any, @Body() body: { propertyId: string; commissionAmount: number }) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User is not authenticated');
    }

    return this.closeDealUseCase.execute({
      propertyId: body.propertyId,
      userId: req.user.id,
      commissionAmount: body.commissionAmount,
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get agent commission statistics' })
  async getStats(@Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User is not authenticated');
    }
    return this.getStatsUseCase.execute(req.user.id);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get agent commission history' })
  async getHistory(@Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User is not authenticated');
    }
    return this.getHistoryUseCase.execute(req.user.id);
  }
}

