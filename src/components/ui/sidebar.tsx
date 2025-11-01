'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { PanelLeft, X } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const SidebarContext = React.createContext<{
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      <TooltipProvider delayDuration={0}>
        <div className="flex min-h-screen">
            {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

const sidebarVariants = cva(
  'h-full flex-col bg-card text-card-foreground border-r transition-all duration-300 ease-in-out',
  {
    variants: {
      isCollapsed: {
        true: 'w-16',
        false: 'w-64',
      },
    },
  }
);

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  
  return (
    <>
        {/* Desktop Sidebar */}
        <aside
        ref={ref}
        className={cn(sidebarVariants({ isCollapsed }), 'hidden md:flex', className)}
        {...props}
        >
            {children}
        </aside>
        
        {/* Mobile Sidebar */}
        <Sheet>
            <SheetTrigger asChild>
                <div />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-r">
                <aside
                    ref={ref}
                    className={cn(sidebarVariants({ isCollapsed: false }), 'flex', className)}
                    {...props}
                >
                    {children}
                </aside>
            </SheetContent>
        </Sheet>
    </>
  );
});
Sidebar.displayName = 'Sidebar';


const sidebarInsetVariants = cva('transition-all duration-300 ease-in-out flex-1 flex flex-col', {
  variants: {
    isCollapsed: {
      true: 'md:ml-16',
      false: 'md:ml-64',
    },
  },
});

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  return <div ref={ref} className={cn(sidebarInsetVariants({ isCollapsed }), className)} {...props} />;
});
SidebarInset.displayName = 'SidebarInset';

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center border-b h-16',
        isCollapsed ? 'justify-center' : 'justify-between px-4',
        className
      )}
      {...props}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex-1 overflow-y-auto', className)} {...props} />
));
SidebarContent.displayName = 'SidebarContent';

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-auto border-t', props.children ? 'p-4' : '')} {...props} />
));
SidebarFooter.displayName = 'SidebarFooter';

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
    const { isCollapsed } = useSidebar();
    return <ul ref={ref} className={cn('space-y-2', isCollapsed ? 'px-2' : 'px-4', className)} {...props} />
});
SidebarMenu.displayName = 'SidebarMenu';

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

export interface SidebarMenuButtonProps extends ButtonProps {
  isActive?: boolean;
  tooltip?: string;
  asChild?: boolean;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, variant, isActive, tooltip, children, asChild, ...props }, ref) => {
  const { isCollapsed } = useSidebar();
  const Comp = asChild ? 'div' : Button;

  const buttonContent = (
    <Comp
      ref={ref as any}
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn(
        'w-full',
        isCollapsed ? 'justify-center h-10 w-10' : 'justify-start',
        className
      )}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.props.children && child.type === 'span' && isCollapsed) {
          return null;
        }
        return child;
      })}
    </Comp>
  );

  if (isCollapsed && tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent side="right">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return buttonContent;
});
SidebarMenuButton.displayName = 'SidebarMenuButton';

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, ...props }, ref) => {
    return (
        <SheetTrigger asChild>
            <Button
                ref={ref}
                variant="ghost"
                size="icon"
                className={cn('md:hidden', className)}
                {...props}
                >
                <PanelLeft />
                <span className="sr-only">Toggle Sidebar</span>
            </Button>
        </SheetTrigger>
    );
});
SidebarTrigger.displayName = 'SidebarTrigger';

export const SidebarClose = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <SheetClose asChild>
        <Button
            ref={ref}
            variant="ghost"
            size="icon"
            className={cn('absolute top-3 right-3', className)}
            {...props}
        >
            <X />
            <span className="sr-only">Close sidebar</span>
        </Button>
      </SheetClose>
    );
  }
);
SidebarClose.displayName = 'SidebarClose';
