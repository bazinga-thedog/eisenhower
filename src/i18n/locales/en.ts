const enTranslations = {
  translations: {
    general: {
      all: 'All',
      are_you_sure: 'Are you sure?',
      cancel: 'Cancel',
      close: 'Close',
      copied: 'Copied',
      create: 'create',
      created: 'created',
      createdon: 'Created on',
      delete: 'Delete',
      description: 'Description',
      done: 'Done',
      edit: 'Edit',
      email: 'Email',
      info: 'info',
      name: 'Name',
      permissions: 'Permissions',
      policies: 'Policies',
      roles: 'Roles',
      restricted: 'Restricted',
      save: 'Save',
      search: 'Search',
      select_available: 'Select available',
      success_past: 'has been successfully',
      title: 'Title',
      to_confirm_undone: 'to confirm. This action cannot be undone',
      to_confirm: 'to confirm',
      type: 'Type',
      updated: 'updated',
      updatedby: 'Updated by',
      updatedon: 'Updated on',
      username: 'Username',
    },
    login: {
      title: 'Login',
      username: 'Username',
      password: 'Password',
      button: 'Login',
      loading: 'Loading...',
      username_ph: 'Enter your username',
      password_ph: 'Enter your password',
    },
    policies: {
      asset: 'Asset',
      asset_select: 'Select an asset',
      add_permission: 'Add new permission',
      create: 'Create policy',
      create_start: 'Create a new policy to get started',
      delete_success: 'deleted successfully',
      description:
        'Configure the necessary policies to assign to specific roles',
      description_name: 'Enter a descriptive name for the policy',
      description_ph: 'Insert policy description',
      edit: 'Edit policy',
      error_creation: 'Policy creation failed',
      info_content:
        'Manage available policies. Each policy will have a set of permissions, when you assign a policy to a user, that user will have those permissions in the application.',
      name_ph: 'Insert policy name',
      no_permissions: "Policy doesn't have any permission",
      not_found: 'No policies found',
      permission: 'Permission',
      operation: 'Operation',
      operation_select: 'Select an operation',
      policy: 'Policy',
      policy_plural: 'Policies',
      resource: 'Resource',
      updatedon: 'Last updated on',
      updatedby: 'Last updated by',
    },
    roles: {
      add_policy: 'Add new policy',
      create: 'Create role',
      description: 'Configure the necessary roles to assign to specific users',
      description_name: 'Enter a descriptive name for the role',
      description_ph: 'Insert role description',
      edit: 'Edit role',
      info_content:
        'Manage available roles. Each role will have a set of policies, when you assign a policy to a user, that user will have the permissions granted by the policies in the application.',
      name_ph: 'Enter a name for the role',
      roles_plural: 'Roles',
    },
    users: {
      add_role: 'Add new role',
      create: 'Create user',
      description: 'Manage users that can use the application',
      description_name: 'Name of the user that will be displayed',
      description_username: 'Username that will be used to login',
      edit: 'Edit user',
      email_ph: 'Enter an email for the user',
      info_content:
        'Manage users. Each user will have a set of roles, when you assign a role to a user, that user will have the permissions granted by the role in the application.',
      name_ph: 'Enter a name for the user',
      no_roles: "User doesn't have any role",
      pass_copy_warning:
        'This is the only time the password will be shown. Please copy and save it.',
      user_plural: 'Users',
      user_created: 'Created user',

      username_ph: 'Enter a username for the user',
    },
    serviceaccounts: {
      serviceaccount_plural: 'Service Accounts',
    },
    /*Pages*/
    enums: {
      Pages: 'Pages',
      Policy: 'Policy',
      Role: 'Role',
      User: 'User',
      READ: 'READ',
      WRITE: 'WRITE',
    },
  },
}

export default enTranslations
