import React, { useState } from 'react'
import {
  DefaultButton,
  PrimaryButton,
  Dialog,
  DialogFooter,
  TextField,
} from '@fluentui/react'
import { Button } from '@fluentui/react-components'
import { DeleteRegular } from '@fluentui/react-icons'
import { t } from 'i18next'

const DeleteButton: React.FC<{
  props: { action: string }
  onDelete: () => void
}> = ({ props: { action }, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const openDialog = () => {
    setInputValue('') // Reset input field
    setIsDialogOpen(true)
  }
  const closeDialog = () => setIsDialogOpen(false)
  const confirmDelete = () => {
    if (inputValue === 'DELETE ' + action) {
      onDelete() // Execute delete action
      closeDialog()
    }
  }

  return (
    <>
      {/* Delete Button */}
      <Button icon={<DeleteRegular />} onClick={openDialog}>
        {t('general.delete')}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog
        hidden={!isDialogOpen}
        onDismiss={closeDialog}
        dialogContentProps={{
          title: t('general.are_you_sure'),
          subText: `${t('general.type')} "DELETE ${action}" ${t('general.to_confirm_undone')}.`,
        }}
      >
        <TextField
          placeholder={`${t('general.type')} "DELETE ${action}" ${t('general.to_confirm')}.`}
          value={inputValue}
          onChange={(e, newValue) => setInputValue(newValue || '')}
        />
        <DialogFooter>
          <PrimaryButton
            onClick={confirmDelete}
            text={t('general.delete')}
            disabled={inputValue !== `DELETE ${action}`}
          />
          <DefaultButton onClick={closeDialog} text={t('general.cancel')} />
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default DeleteButton
