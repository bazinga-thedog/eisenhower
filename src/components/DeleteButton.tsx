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
        Delete ###
      </Button>

      {/* Confirmation Dialog */}
      <Dialog
        hidden={!isDialogOpen}
        onDismiss={closeDialog}
        dialogContentProps={{
          title: 'Are you sure?',
          subText: `This action cannot be undone. Type "DELETE ${action}" to confirm.`,
        }}
      >
        <TextField
          placeholder={`Type "DELETE ${action}" to confirm.`}
          value={inputValue}
          onChange={(e, newValue) => setInputValue(newValue || '')}
        />
        <DialogFooter>
          <PrimaryButton
            onClick={confirmDelete}
            text="Delete"
            disabled={inputValue !== `DELETE ${action}`}
          />
          <DefaultButton onClick={closeDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default DeleteButton
