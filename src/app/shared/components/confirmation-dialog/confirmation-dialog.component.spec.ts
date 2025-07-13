import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from './confirmation-dialog.component';
import { MaterialModule } from '../../modules/material/material-module';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

  const mockDialogData: ConfirmationDialogData = {
    title: 'Test Title',
    description: 'Test Description',
    confirmText: 'Test Confirm',
    cancelText: 'Test Cancel',
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponent],
      imports: [MaterialModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    }).compileComponents();

    mockDialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<ConfirmationDialogComponent>
    >;

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with provided dialog data', () => {
      expect(component.data.title).toBe('Test Title');
      expect(component.data.description).toBe('Test Description');
      expect(component.data.confirmText).toBe('Test Confirm');
      expect(component.data.cancelText).toBe('Test Cancel');
    });

    it('should set default confirm text when not provided', () => {
      const dataWithoutConfirmText = {
        title: 'Test',
        description: 'Test',
        cancelText: 'Cancel',
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [ConfirmationDialogComponent],
        imports: [MaterialModule, NoopAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: dataWithoutConfirmText },
        ],
      });

      fixture = TestBed.createComponent(ConfirmationDialogComponent);
      component = fixture.componentInstance;

      expect(component.data.confirmText).toBe('Confirm');
    });

    it('should set default cancel text when not provided', () => {
      const dataWithoutCancelText = {
        title: 'Test',
        description: 'Test',
        confirmText: 'Confirm',
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [ConfirmationDialogComponent],
        imports: [MaterialModule, NoopAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: dataWithoutCancelText },
        ],
      });

      fixture = TestBed.createComponent(ConfirmationDialogComponent);
      component = fixture.componentInstance;

      expect(component.data.cancelText).toBe('Cancel');
    });

    it('should set both default texts when neither provided', () => {
      const minimalData = {
        title: 'Test',
        description: 'Test',
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [ConfirmationDialogComponent],
        imports: [MaterialModule, NoopAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: minimalData },
        ],
      });

      fixture = TestBed.createComponent(ConfirmationDialogComponent);
      component = fixture.componentInstance;

      expect(component.data.confirmText).toBe('Confirm');
      expect(component.data.cancelText).toBe('Cancel');
    });
  });

  describe('Dialog Actions', () => {
    it('should close dialog with false when onCancel is called', () => {
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('should close dialog with true when onConfirm is called', () => {
      component.onConfirm();

      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });

    it('should handle multiple cancel calls', () => {
      component.onCancel();
      component.onCancel();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(2);
      expect(mockDialogRef.close).toHaveBeenCalledWith(false);
    });

    it('should handle multiple confirm calls', () => {
      component.onConfirm();
      component.onConfirm();

      expect(mockDialogRef.close).toHaveBeenCalledTimes(2);
      expect(mockDialogRef.close).toHaveBeenCalledWith(true);
    });
  });

  describe('Dialog Data Interface', () => {
    it('should have required properties in dialog data', () => {
      expect(component.data.title).toBeDefined();
      expect(component.data.description).toBeDefined();
    });

    it('should allow optional properties in dialog data', () => {
      expect(component.data.confirmText).toBeDefined();
      expect(component.data.cancelText).toBeDefined();
    });

    it('should handle empty strings for optional properties', () => {
      const dataWithEmptyStrings = {
        title: 'Test',
        description: 'Test',
        confirmText: '',
        cancelText: '',
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [ConfirmationDialogComponent],
        imports: [MaterialModule, NoopAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: dataWithEmptyStrings },
        ],
      });

      fixture = TestBed.createComponent(ConfirmationDialogComponent);
      component = fixture.componentInstance;

      // Empty strings should be replaced with defaults
      expect(component.data.confirmText).toBe('Confirm');
      expect(component.data.cancelText).toBe('Cancel');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long titles and descriptions', () => {
      const longText = 'A'.repeat(1000);
      const dataWithLongText = {
        title: longText,
        description: longText,
        confirmText: 'OK',
        cancelText: 'Cancel',
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [ConfirmationDialogComponent],
        imports: [MaterialModule, NoopAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: dataWithLongText },
        ],
      });

      fixture = TestBed.createComponent(ConfirmationDialogComponent);
      component = fixture.componentInstance;

      expect(component.data.title).toBe(longText);
      expect(component.data.description).toBe(longText);
    });

    it('should handle special characters in text', () => {
      const specialCharText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const dataWithSpecialChars = {
        title: specialCharText,
        description: specialCharText,
        confirmText: specialCharText,
        cancelText: specialCharText,
      };

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        declarations: [ConfirmationDialogComponent],
        imports: [MaterialModule, NoopAnimationsModule],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: dataWithSpecialChars },
        ],
      });

      fixture = TestBed.createComponent(ConfirmationDialogComponent);
      component = fixture.componentInstance;

      expect(component.data.title).toBe(specialCharText);
      expect(component.data.description).toBe(specialCharText);
      expect(component.data.confirmText).toBe(specialCharText);
      expect(component.data.cancelText).toBe(specialCharText);
    });
  });
});
