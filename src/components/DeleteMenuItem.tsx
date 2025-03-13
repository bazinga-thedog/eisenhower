import React, { useState } from 'react'
import { Dialog } from '@fluentui/react'
import {
  Button,
  DialogActions,
  DialogBody,
  DialogSurface,
  DialogTitle,
  MenuItem,
} from '@fluentui/react-components'
import { Delete16Regular } from '@fluentui/react-icons'

const DeleteMenuItem: React.FC<{
  props: { action: string; disabled: boolean }
  onDelete: () => void
}> = ({ props: { action, disabled }, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  const [inputValue, setInputValue] = useState('')

  const openDialog = () => {
    console.log('openDialog')
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
      <MenuItem
        icon={<Delete16Regular />}
        disabled={disabled}
        onClick={openDialog}
      >
        Delete###
      </MenuItem>

      {isDialogOpen && (
        <Dialog>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Are you sure?</DialogTitle>
              <p>This action cannot be undone.</p>
              <DialogActions>
                <Button appearance="primary" onClick={confirmDelete}>
                  Yes, Delete
                </Button>
                <Button onClick={closeDialog}>Cancel</Button>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      )}
    </>
  )
}

export default DeleteMenuItem
