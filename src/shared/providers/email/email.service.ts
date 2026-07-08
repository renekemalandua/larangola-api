import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Resend } from 'resend';
import { GLOBAL_CONFIG } from '../../configs';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailService implements OnModuleInit {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private templates: Record<string, handlebars.TemplateDelegate> = {};
  private baseTemplate: handlebars.TemplateDelegate;

  constructor() {
    const apiKey = GLOBAL_CONFIG.resendApiKey;
    this.fromEmail = GLOBAL_CONFIG.mailFrom || 'noreply@larangola.ao';
    
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log(`Resend initialized with sender: ${this.fromEmail}`);
    } else {
      this.logger.warn('RESEND_API_KEY is not defined. Email service will run in mock mode.');
    }
  }

  onModuleInit() {
    this.loadTemplates();
  }

  private loadTemplates() {
    try {
      const templatesDir = path.join(__dirname, 'templates');
      
      const baseSource = fs.readFileSync(path.join(templatesDir, 'base.hbs'), 'utf8');
      this.baseTemplate = handlebars.compile(baseSource);

      const templateFiles = ['welcome', 'visit-confirmation', 'visit-notification', 'visit-status', 'reset-otp'];
      
      for (const file of templateFiles) {
        const source = fs.readFileSync(path.join(templatesDir, `${file}.hbs`), 'utf8');
        this.templates[file] = handlebars.compile(source);
      }
      this.logger.log('Email templates loaded successfully.');
    } catch (error: any) {
      this.logger.error(`Failed to load email templates: ${error.message}`);
    }
  }

  private compileHtml(templateName: string | null, context: any, htmlContent?: string): string {
    const year = new Date().getFullYear();
    let body = htmlContent || '';

    if (templateName && this.templates[templateName]) {
      body = this.templates[templateName](context);
    }

    if (this.baseTemplate) {
      return this.baseTemplate({ 
        ...context, 
        body, 
        year,
        logoUrl: GLOBAL_CONFIG.emailLogo 
      });
    }
    
    return body;
  }

  async sendWelcome(to: string, name: string): Promise<boolean> {
    const title = 'Bem-vindo ao LarAngola! 🏠';
    const html = this.compileHtml('welcome', { title, name });
    return this.sendEmail(to, title, html);
  }

  async sendVisitConfirmation(to: string, name: string, propertyTitle: string, date: string, time: string): Promise<boolean> {
    const title = 'Visita Agendada com Sucesso ✅';
    const html = this.compileHtml('visit-confirmation', { title, name, propertyTitle, date, time });
    return this.sendEmail(to, title, html);
  }

  async sendVisitNotificationToAgent(to: string, agentName: string, clientName: string, propertyTitle: string, date: string, time: string): Promise<boolean> {
    const title = 'Nova Solicitação de Visita 🔔';
    const html = this.compileHtml('visit-notification', { title, agentName, clientName, propertyTitle, date, time });
    return this.sendEmail(to, title, html);
  }

  async sendVisitStatusUpdate(to: string, name: string, newStatus: string, propertyTitle: string, date: string, time: string): Promise<boolean> {
    const title = 'Atualização sobre a sua Visita 📅';
    
    let statusColor = '#475569';
    const isConfirmed = newStatus.toLowerCase().includes('confirmada');
    
    if (isConfirmed) statusColor = '#16a34a';
    if (newStatus.toLowerCase().includes('cancelada') || newStatus.toLowerCase().includes('rejeitada')) statusColor = '#dc2626';

    const html = this.compileHtml('visit-status', { title, name, newStatus, propertyTitle, date, time, statusColor, isConfirmed });
    return this.sendEmail(to, title, html);
  }

  async sendPasswordResetOtp(to: string, name: string, otp: string): Promise<boolean> {
    const title = 'Código de Recuperação de Senha 🔒';
    const html = this.compileHtml('reset-otp', { title, name, otp });
    return this.sendEmail(to, title, html);
  }

  async sendBroadcast(recipients: string[], subject: string, htmlContent: string): Promise<boolean> {
    if (!this.resend) {
      this.logger.warn(`[MOCK EMAIL BROADCAST] to ${recipients.length} recipients - Subject: ${subject}`);
      return true;
    }

    try {
      const batchSize = 100;
      let success = true;
      const html = this.compileHtml(null, { title: subject }, htmlContent);

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const emailOptions = batch.map(to => ({
          from: this.fromEmail,
          to,
          subject,
          html,
        }));

        const { error } = await this.resend.batch.send(emailOptions);
        
        if (error) {
          this.logger.error(`Error sending broadcast batch: ${error.message}`);
          success = false;
        }
      }

      if (success) {
        this.logger.log(`Broadcast sent successfully to ${recipients.length} recipients`);
      }
      return success;
    } catch (error: any) {
      this.logger.error(`Failed to send broadcast: ${error.message}`);
      return false;
    }
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.resend) {
      this.logger.warn(`[MOCK EMAIL] to: ${to} | subject: ${subject}`);
      return true;
    }

    try {
      const { error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Error sending email to ${to}: ${error.message}`);
        return false;
      }

      this.logger.log(`Email sent successfully to ${to}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      return false;
    }
  }
}
